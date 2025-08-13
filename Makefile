.PHONY: up frontend backend dev

FRONT_COLOR=\033[1;32m
BACK_COLOR=\033[1;34m
RESET_COLOR=\033[0m

build:
	@echo "$(FRONT_COLOR)[INSTALL FRONTEND]$(RESET_COLOR)"
	@cd frontend && npm install
	@echo "$(BACK_COLOR)[INSTALL BACKEND]$(RESET_COLOR)"
	@cd backend && pip install -r requirements.txt
	
up:
	@echo "$(FRONT_COLOR)[ FRONTEND + BACKEND START ]$(RESET_COLOR)"
	@$(MAKE) -j 2 frontend backend

dev:
	@echo "$(FRONT_COLOR)[ FRONTEND + BACKEND DEV MODE ]$(RESET_COLOR)"
	@$(MAKE) -j 2 frontend backend

frontend:
	cd frontend && npm run dev

backend:
	python3 backend/app/main.py