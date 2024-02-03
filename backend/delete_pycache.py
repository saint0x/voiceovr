import os
import shutil

# Get current working directory
cwd = os.getcwd() 

# Path to __pycache__ folder
pycache_path = os.path.join(cwd, '__pycache__')

# Check if __pycache__ folder exists
if os.path.exists(pycache_path):

    # Loop through and delete all files in the folder
    for root, dirs, files in os.walk(pycache_path):
        for file in files:
            os.remove(os.path.join(root, file))
    
    # Delete the empty folder
    shutil.rmtree(pycache_path)
    
    print('__pycache__ folder deleted successfully!')

else:
    print('__pycache__ folder does not exist.')
