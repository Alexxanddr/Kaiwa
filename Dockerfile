FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    KAIWA_PORT=8130 \
    KAIWA_OLLAMA_URL=http://host.docker.internal:11434

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY server/ ./server/
COPY web/ ./web/

RUN mkdir -p /app/data /app/models \
    && useradd --create-home --uid 10001 kaiwa \
    && chown -R kaiwa:kaiwa /app

USER kaiwa
EXPOSE 8130

CMD ["sh", "-c", "exec uvicorn server.main:app --host 0.0.0.0 --port \"$KAIWA_PORT\""]