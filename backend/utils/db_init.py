"""
Database initialization and seeding
"""
import logging
from database.session import engine
from database.models.classroom import Classroom, Building
from database.models.occupancy import Occupancy
from database.models.schedule import ClassSchedule
from shared_data import BUILDINGS
from data.classrooms import ALL_CLASSROOMS
from data.schedules import SAMPLE_SCHEDULES

logger = logging.getLogger(__name__)


def create_tables():
    """Create all database tables"""
    from database.session import Base
    
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")


def seed_classrooms():
    """Seed classrooms from shared data"""
    from database.session import SessionLocal
    db = SessionLocal()
    
    try:
        logger.info("Seeding classrooms...")
        
        # First, check if data already exists
        existing_classrooms = db.query(Classroom).count()
        if existing_classrooms > 0:
            logger.info("Classrooms already seeded. Skipping...")
            return
        
        # Seed buildings
        for building in BUILDINGS:
            db_building = Building(
                id=building['id'],
                name=building['name'],
                faculty=building['faculty'],
                floors=str(building['floors']),
            )
            db.merge(db_building)
        
        # Seed classrooms
        for classroom in ALL_CLASSROOMS:
            db_classroom = Classroom(
                id=classroom['id'],
                room_number=classroom['roomNumber'],
                building_id=classroom['buildingId'],
                faculty=classroom['faculty'],
                floor=classroom['floor'],
                capacity=classroom['capacity'],
                has_projector=classroom['hasProjector'],
                has_wifi=classroom['hasWifi'],
                has_power_outlets=classroom['hasPowerOutlets'],
            )
            db.add(db_classroom)
        
        # Initialize occupancy records
        for classroom in ALL_CLASSROOMS:
            db_occupancy = Occupancy(
                id=f"occ_{classroom['id']}",
                classroom_id=classroom['id'],
                current_count=0,
                detection_confidence=0.0,
            )
            db.merge(db_occupancy)
        
        db.commit()
        logger.info(f"Seeded {len(ALL_CLASSROOMS)} classrooms successfully")
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding classrooms: {e}")
        raise
    finally:
        db.close()


def seed_schedules():
    """Seed class schedules"""
    from database.session import SessionLocal
    db = SessionLocal()
    
    try:
        logger.info("Seeding class schedules...")
        
        # Check if schedules already exist
        existing_schedules = db.query(ClassSchedule).count()
        if existing_schedules > 0:
            logger.info("Schedules already seeded. Skipping...")
            return
        
        # Seed class schedules
        for schedule in SAMPLE_SCHEDULES:
            db_schedule = ClassSchedule(
                id=schedule['id'],
                classroom_id=schedule['classroom_id'],
                class_name=schedule['class_name'],
                instructor=schedule.get('instructor'),
                day_of_week=schedule['day_of_week'],
                period=schedule['period'],
                start_time=schedule['start_time'],
                end_time=schedule['end_time'],
                semester=schedule.get('semester'),
                course_code=schedule.get('course_code'),
            )
            db.add(db_schedule)
        
        db.commit()
        logger.info(f"Seeded {len(SAMPLE_SCHEDULES)} class schedules successfully")
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding schedules: {e}")
        raise
    finally:
        db.close()


def init_database():
    """Initialize database with tables and seed data"""
    create_tables()
    seed_classrooms()
    seed_schedules()


if __name__ == "__main__":
    import sys
    import logging
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    try:
        init_database()
        print("Database initialized successfully!")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        sys.exit(1)

