# This file is to prepare the project for the development environment.
# Required as deploying package.json to Heroku with proxy set will
# cause an internal server error.
# Call it every time you have done a recent deploy and push to git.
# This new branch is your new dev branch from which to pull feature
# branches.

import json

with open('./package.json', 'r+') as f:
    data = json.load(f)
    data['proxy'] = 'http://127.0.0.1:5000' # <--- add `id` value.
    f.seek(0)        # <--- should reset file position to the beginning.
    json.dump(data, f, indent=4)
    f.truncate()     # remove remaining part