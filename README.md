# Nirvana: AI-Powered Citizen Grievance Redressal System

## 🚀 Current Status

✅ **Development Completed**  
⚠️ **Deployment Pending**

The Nirvana project has reached a significant milestone: **core development is complete**. However, due to the complex architecture and advanced AI integrations, we currently **cannot deploy it on standard cloud platforms** without further research and optimization.

---

## 🧠 Key Features

### 🔊 Voice Recognition System
- Integrated **voice-to-text complaint logging**.
- Powered by a **custom pipeline** using ElevenLabs API.
- Enables citizens to report issues in natural language via voice.

### 🖼️ Self-Trained Image Recognition Model
- Built using **YOLOv8**, trained on **custom complaint image datasets**.
- Automatically detects and categorizes visual issues (e.g., potholes, garbage, broken streetlights).
- Ensures faster processing and categorization without human intervention.

### 🤖 ML-Powered Text Classification
- Leverages **Gemini** for semantic understanding of complaint descriptions.
- Prioritizes and categorizes text-based complaints based on urgency and type.

---

## 💥 Why Deployment Is Complex

Nirvana involves several **hardcore dependencies and advanced components**:

1. **Real-Time Voice Recognition APIs**
   - Requires low-latency, scalable environments.
   - Sensitive to cross-platform compatibility and audio processing constraints.

2. **Self-Trained Image Detection Model**
   - YOLO model (`best.pt`) is large and requires GPU/accelerated hardware.
   - Model hosting and inference scaling need specialized infrastructure.

3. **ML Backends (Text + Image)**
   - Multiple models must run in parallel with minimal delay.
   - Requires orchestrated microservices or advanced queue management (e.g., Celery, RabbitMQ).

4. **External APIs & Secrets**
   - Uses services like ElevenLabs, Gemini, and possibly LangChain.
   - Managing API rate limits and security during deployment needs careful planning.

---

## 🔍 Next Steps

- 🔧 **Explore containerized deployments** (Docker + GPU support).
- ☁️ **Test on advanced cloud platforms** (e.g., AWS EC2 with GPU, Render with buildpacks, or Hugging Face Spaces).
- 📦 **Bundle models with lightweight inference servers** like FastAPI or TensorRT.
- 🔒 **Secure API key management** with environment variable best practices.
- 📚 **Study production-grade model serving** using tools like:
  - TorchServe
  - Triton Inference Server
  - ONNX Runtime

---

## 💡 Summary

Nirvana is **functionally ready**, with cutting-edge AI features built in.  
But deployment requires **deeper infrastructure understanding** due to high-performance dependencies.

> 🚧 We’re actively exploring optimized, scalable deployment options to make Nirvana fully operational in a production environment.

---

## 🛠️ Tech Stack

- **Frontend**: HTML + TailwindCSS
- **Backend**: Python (Flask)
- **Image Recognition**: YOLOv8 (custom-trained)
- **Text Classification**: Gemini API
- **Voice Recognition**: ElevenLabs API
- **Storage**: Supabase
- **Hosting (Planned)**: Render / Hugging Face / AWS (TBD)

---

## 🧹 Key Features Summary

* 🤖 **AI/ML Complaint Management**
* 🗺️ **Geo-tagged Reporting**
* 📊 **Real-time Dashboards**
* 🗣️ **Multilingual & Inclusive**
* 🔐 **Transparent & Auditable**
* 📱 **WhatsApp-Based Citizen Interface** ✅
* 🌐 **Modular Architecture**

---

## 🌐 System Architecture Overview

```
Citizen (via WhatsApp)
     ↓
WhatsApp Business API (Webhook → Flask)
     ↓
Nirvana Bot (Flask + Python + ML models)
     ↓
Supabase (Database + Auth + Real-time Sync)
     ↓
Admin Dashboard (React + Vite + Tailwind)
```

* **Frontend:** Admin dashboard for officials to view, filter, and act on complaints
* **Backend:** Python Flask app with real-time webhook handling for WhatsApp messages
* **ML Models:** Categorization, prioritization, sentiment analysis
* **Storage & Sync:** Supabase for structured complaint logs and real-time updates
* **Location & Media:** Image + GPS capture directly via WhatsApp
* **Deployment:** Modular microservices for scalability

---

The WhatsApp chatbot isn’t just a feature—**it’s a foundational pillar of Nirvana’s mission** to democratize access to responsive governance, remove barriers to participation, and ensure every voice is heard and logged in real-time.
