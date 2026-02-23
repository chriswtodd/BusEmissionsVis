using System;
using System.Diagnostics;
using System.IO;
using Microsoft.Extensions.Configuration;
using Renci.SshNet;

var builder = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true)
    .AddCommandLine(args);

IConfiguration config = builder.Build();

const string rootSourceDirectory = "C:\\git\\bevferle";
const string rootBuildDirectory = "C:\\built\\bevferle";
const string uiDirectory = "C:\\built\\bevferle\\ui";
const string apiDirectory = "C:\\built\\bevferle\\api";

string rootNetworkDrive = $"{config["staging:rootNetworkDrive"]}";
string appDir = $"\"{rootNetworkDrive}{config["staging:appDir"]}\"";
string configDir = $"{config["staging:configDir"]}";
string backupDir = $"{config["staging:backupDir"]}";
string rootBevferleBuildDirectory = $"{appDir}{config["staging:buildDir"]}";
string connectionString = $"{config["aws:ec2:user"]}@{config["aws:ec2:host"]}:";
string pem = $"{rootNetworkDrive}{config["aws:ec2:pem"]}";
const string serviceFileLocation = "/etc/systemd/system/";
const string nginxSitesEnabled = "/etc/nginx/sites-enabled/";

await Run(
    "Cloning Repository",
    "git",
    $"clone https://github.com/chriswtodd/BusEmissionsVis.git {rootSourceDirectory}"
);

var version = await Run(
    "Echoing old version",
    "powershell",
    $"(Get-Command \"{apiDirectory}\\Server.dll\").FileVersionInfo.FileVersion"
);

version = version.Trim();

CreateDirectoryIfNotExists(rootSourceDirectory);
CreateDirectoryIfNotExists(rootBuildDirectory);
CreateDirectoryIfNotExists(uiDirectory);
CreateDirectoryIfNotExists(apiDirectory);
CreateDirectoryIfNotExists($"{backupDir}\\{version}");
CreateDirectoryIfNotExists($"{backupDir}\\{version}-config");

await Run(
    "Backing up previous files: Built Application",
    "scp",
    $"{rootBuildDirectory} {backupDir}\\{version}\\"
);

await Run(
    "Backing up previous files: Config",
    "scp",
    $"{configDir} {backupDir}\\{version}-config\\"
);

await Run(
    "Copying UI configuration files to config dir",
    "scp",
    $"{appDir}\\.env.* {configDir}"
);

await Run(
    "Copying API configuration files to config dir",
    "scp",
    $"{appDir}\\platform\\server\\appsettings* {configDir}\\platform\\server\\"
);

await Run(
    "Copying all configuration files to repo",
    "scp",
    $"{configDir} {rootSourceDirectory}"
);

await Run(
    "Publishing .NET Application",
    "dotnet",
    $"publish \"{rootSourceDirectory}\\platform\\server\" -c Release -o \"{apiDirectory}\" --runtime linux-x64"
);

await Run(
    "Installing npm dependencies",
    @"C:\Program Files\nodejs\npm.cmd", 
    $"install --prefix {rootSourceDirectory}"
);

await Run(
    "Running vite build",
    @"C:\Program Files\nodejs\npm.cmd", 
    $"run build --prefix {rootSourceDirectory}"
);

// sudo yum install nginx
// sudo yum install dotnet runtime

using (var client = new SshClient(config["aws:ec2:host"], config["aws:ec2:user"], new PrivateKeyFile(pem)))
{
    client.Connect();
    RunSshCommand($"sudo systemctl stop bevferle-server.service", client);
    RunSshCommand($"sudo rm -rf {config["aws:ec2:destination"]}", client);
    RunSshCommand($"sudo mkdir -p {config["aws:ec2:destination"]}", client);
    RunSshCommand($"sudo setfacl -m u:ec2-user:rwx {config["aws:ec2:destination"]}", client);
    RunSshCommand($"sudo setfacl -m u:ec2-user:rwx {serviceFileLocation}", client);
    RunSshCommand($"sudo setfacl -m u:ec2-user:rwx {nginxSitesEnabled}", client);
    client.Disconnect();
}

await Run(
    "Installing .NET application",
    @"scp",
    $"-i \"{pem}\" {config["aws:ec2:source"]} {connectionString}{config["aws:ec2:destination"]}"
);

await Run(
    "Configuring service for .NET application",
    @"scp",
    $"-i \"{pem}\" {rootBevferleBuildDirectory}bevferle-server.service\" {connectionString}{serviceFileLocation}"
);

await Run(
    "Configuring nginx for service",
    @"scp",
    $"-i \"{pem}\" {rootBevferleBuildDirectory}bevferle-server.conf\" {connectionString}/etc/nginx/sites-available"
);

using (var client = new SshClient(config["aws:ec2:host"], config["aws:ec2:user"], new PrivateKeyFile(pem)))
{
    client.Connect();
    RunSshCommand($"sudo systemctl daemon-reexec", client);
    RunSshCommand($"sudo systemctl daemon-reload", client);
    RunSshCommand($"sudo systemctl enable bevferle-server.service", client);
    RunSshCommand($"sudo systemctl start bevferle-server.service", client);
    RunSshCommand($"sudo systemctl status bevferle-server.service", client);
    RunSshCommand($"sudo ln -s /etc/nginx/sites-available/dotnetapp {nginxSitesEnabled}", client);
    RunSshCommand($"sudo nginx -t", client);
    RunSshCommand($"sudo systemctl restart nginx", client);
    RunSshCommand($"sudo ufw allow 'Nginx Full'", client);
    RunSshCommand($"sudo ufw enable", client);
}

async Task<string> Run(string displayMessage, string fileName, string args)
{
    ConsoleSpinner.Start();
    Console.WriteLine(displayMessage);
    ProcessStartInfo startInfo = new()
    {
        FileName = fileName,
        Arguments = args,
        CreateNoWindow = true,
        RedirectStandardOutput = true,
        RedirectStandardError = true,
    };
    Console.WriteLine($"Starting {fileName} with args: {args}");
    var proc = Process.Start(startInfo);
    ArgumentNullException.ThrowIfNull(proc);
    string output = proc.StandardOutput.ReadToEnd();
    await proc.WaitForExitAsync();
    ConsoleSpinner.Stop();
    return output;
}

void RunSshCommand(string command, SshClient client)
{
    Console.WriteLine($"Running {command} in SSH session");
    using SshCommand cmd = client.RunCommand(command);
    Console.WriteLine("Standard Output: " + cmd.Result);

    using (var reader = new StreamReader(cmd.ExtendedOutputStream))
    {
        var error = reader.ReadToEnd();
        Console.WriteLine("Standard Error: " + error);
    }
    
    Console.WriteLine("Exit Status: " + cmd.ExitStatus);
}

void CreateDirectoryIfNotExists(string directory)
{
    Console.WriteLine($"Creating directory {directory}");
    if (!Directory.Exists(directory))
    {
        Directory.CreateDirectory(directory);
    }
}

public class ConsoleSpinner
{
    private static int spinnerInterval = 100;
    private static string[] spinnerFrames = { "/", "-", "\\", "|" };
    private static bool isSpinning = false;
    private static int currentFrame = 0;

    public static void Start()
    {
        isSpinning = true;
        Task.Run(() =>
        {
            while (isSpinning)
            {
                Console.SetCursorPosition(0, Console.CursorTop);
                Console.Write(spinnerFrames[currentFrame++]);
                currentFrame = currentFrame % spinnerFrames.Length;
                Thread.Sleep(spinnerInterval);
            }
        });
    }

    public static void Stop()
    {
        isSpinning = false;
        Console.SetCursorPosition(0, Console.CursorTop);
    }
}