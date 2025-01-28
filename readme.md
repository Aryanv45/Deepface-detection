# Deepfake Detection

### A Full-Stack Deepfake Detection Application developed FastAPI, Tensorflow, OpenCV, React.js and Tailwind CSS

## To run this project locally:
#### Pre requisites: Python(>=3.10), Node.js(>=18.19)

* Clone this repository
```
git clone https://github.com/Aryanv45/deepface-detection.git
cd deepfake-detection
```
* Setup python virtual environment and install dependencies
```
python3 -m venv ./venv
source ./venv/bin/activate
pip install -r requirements.txt
```
* Install frontend dependencies (present inside cilent directory)
```
cd client
npm install
```

* Go to parent directory (where app.py is located) and run the FastAPI server using:
```
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
Now our FastAPI server must be running on localhost:8000 (make sure that your port 8000 is free before running previous command).

* Go to client directory and create another terminal (where package.json is located) and run the React App using:
```
npm run dev
```
Now our React App must be running on localhost:5173 (or on any port >5173 if it is not free).





## Screenshots
<img src="client/public/df1.png"/>
<img src="client/public/df2.png"/>
<img src="client/public/df3.png"/>
<img src="client/public/df5.png"/>
<img src="client/public/df4.png"/>
