# teachable-machine-node-api

This is a demonstation of using Google's [Teachable Machine](https://github.com/googlecreativelab/teachablemachine-community) with node.js

It use [nest js](https://github.com/nestjs/nest) as the app framework. 

It is a rest API for getting a prediction based on a image model created with Teachable Machine.

The API exposes two endpoints: 
- GET /health 
- POST /predict 

## Usage 
- Run `npm install`
- Edit `.env` file with your model 
- Run app server with `npm start`
- Post an image to the endpoint `/predict` 

## Example Usage 

Usage with Postman: 

![Alt text](/assets/request.PNG "Request")

Response:

![Alt text](/assets/response.PNG "Request")

Usage with CURL:

``curl -v -F "file=@banana.jpg" http://localhost:3000/predict ``

### Notes 
- This model is taken from [here](https://medium.com/@warronbebster/teachable-machine-tutorial-bananameter-4bfffa765866)
- In next versions:
    - Will add the ability to train the model
    - Will enable to load model from the file system.

####  Start this project if you found it useful 