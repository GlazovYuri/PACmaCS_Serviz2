.PHONY: up frontend backend

up:
	@$(MAKE) -j 2 frontend backend

frontend:
	cd frontend && npm run dev

backend:
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000