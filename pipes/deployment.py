# This file is to prepare the project for the deployment environment.
# Required as deploying package.json to Heroku with proxy set will
# cause an internal server error.
# Call it every time you have finished features ready to be pushed
# to Heroku.
# Deploy to Heroku using git push heroku <currentDeployName>:main.

import json

with open('./package.json', 'r+') as f:
    data = json.load(f)
    del data['proxy']
    f.seek(0)        # <--- should reset file position to the beginning.
    json.dump(data, f, indent=4)
    f.truncate()     # remove remaining part