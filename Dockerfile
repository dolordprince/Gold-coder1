FROM python:3.11-slim

WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl git \
    && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/bytedance/trae-agent.git /app/trae-agent
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN chmod +x hf-opencode-start.sh

EXPOSE 7860
CMD ["./hf-opencode-start.sh"]
