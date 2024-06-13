FROM ubuntu:20.04

WORKDIR /app
COPY . .
RUN apt-get -y update && apt-get install -y python3 python3-pip
RUN pip3 install dotenv fastapi==0.111.0 google-generativeai==0.6.0
EXPOSE 5000
CMD ["python3", "app.py"]