### Start the program
1. Run command "yarn" to install all the dependencies.
2. Run command "yarn codegen" to generate database schemas.
3. Run command "yarn build" to build executables.
4. Run command "docker-compose up" to start the program.

### Stop the program
Run command "docker-compose down" to stop the program.

### Remove data
Run command "sudo rm -rf .data" to clean all the data in database.

### Attention
If need to run bifrost-polkadot independently, need to uncomment the postgres service in docker-compose.yml file.
Currentyly, it is commented out to use the same postgres with bifrost-kusama.
