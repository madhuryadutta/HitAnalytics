## 🚨 **Notice: Project Discontinued** 🚨  
This project is no longer maintained. Hitanalytics is a FastAPI-based web application designed to track unique visitors every 24 hours. It ensures accurate analytics by maintaining visitor records while optimizing performance through efficient database management and logging mechanisms. Active development and support have been discontinued. Feel free to fork the repository or modify it for personal use.  

---

### **Installation**  
#### **1. Install Dependencies**  
Using `pip`:  
```sh
pip install fastapi  
pip install "uvicorn[standard]"
```
Or using `requirements.txt`:  
```sh
pip install -r requirements.txt
```

### **Running the Application**  
#### **2. Run FastAPI with Uvicorn**  
Basic run:  
```sh
uvicorn main:app --reload
```
With proxy headers:  
```sh
uvicorn main:app --proxy-headers --reload
```

### **Docker Setup**  
#### **3. Build & Run with Docker**  
Build the image:  
```sh
docker build -t fastapi .
```
Run the container:  
```sh
docker run -d --name fastapi -p 80:80 fastapi
```

---
