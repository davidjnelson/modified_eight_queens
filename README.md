# General

- The program runs as a web application on your local machine on port 8080.

# Installation And Usage

- If you are running on OSX, make sure you have the Xcode Developer Tools: ```xcode-select --install```
- Install NVM: ```curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash``` ( [other ways available here](https://github.com/creationix/nvm) )
- Install what were the latest Node and NPM as of when this was created: ```nvm install 8.1.2```.  This will also install npm 5.0.3.
- To clean, run ```make clean```.
- To build assets ready for deployment in the ```./build``` directory, run ```make build```.  ```make build```does not run ```make clean``` as ```make clean``` erases the node_modules directory, which would require the ```npm install``` that occurs during ```make build``` to re-download all dependencies.
- To test, run ```make test```.
- To run, run ```make run```.  ```make run``` always runs ```make build``` before running to copy the html and css files the application uses.  Then load [http://localhost:8080](http://localhost:8080) in your web browser.
- The application was developed and tested using Chrome on OSX.  It is recommended to run it in Chrome on OSX.
