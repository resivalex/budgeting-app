from main import app, scheduler, logger

@app.on_event("startup")
def start_scheduler():
    try:
        if not scheduler.running:
            scheduler.start()
            
            job = scheduler.get_job("daily_dump")
            if job:
                next_run = job.next_run_time.strftime('%Y-%m-%d %H:%M:%S UTC') if job.next_run_time else "unknown"
                logger.info(f"Background scheduler started with daily dump job (next run: {next_run})")
            else:
                logger.warning("Background scheduler started but daily_dump job not found")
        else:
            logger.info("Scheduler already running, not starting again")
    except Exception as e:
        logger.error(f"Failed to start scheduler: {str(e)}")


@app.on_event("shutdown")
def shutdown_scheduler():
    try:
        if scheduler.running:
            scheduler.shutdown()
            logger.info("Background scheduler shut down")
    except Exception as e:
        logger.error(f"Error shutting down scheduler: {str(e)}")
