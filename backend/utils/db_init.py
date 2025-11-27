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


def seed_classrooms(force_update: bool = False):
    """Seed classrooms from shared data
    
    Args:
        force_update: If True, update existing classrooms and add new ones from JSON.
                     If False, skip if classrooms already exist.
    """
    from database.session import SessionLocal
    from data.classrooms import _load_classrooms  # 最新のJSONを再読み込み
    
    db = SessionLocal()
    
    try:
        logger.info("Seeding classrooms...")
        
        # 最新のJSONデータを再読み込み
        current_classrooms = _load_classrooms()
        logger.info(f"Loaded {len(current_classrooms)} classrooms from JSON")
        
        # First, check if data already exists
        existing_classrooms = db.query(Classroom).count()
        if existing_classrooms > 0 and not force_update:
            logger.info(f"Classrooms already seeded ({existing_classrooms} existing). Skipping...")
            logger.info("To update with latest JSON data, use force_update=True")
            return
        
        if force_update:
            logger.info("Force update mode: Updating existing classrooms and adding new ones...")
        
        # Seed buildings
        for building in BUILDINGS:
            db_building = Building(
                id=building['id'],
                name=building['name'],
                faculty=building['faculty'],
                floors=str(building['floors']),
            )
            db.merge(db_building)
        
        # Get existing classroom IDs for comparison
        existing_ids = {c.id for c in db.query(Classroom).all()}
        json_ids = {c['id'] for c in current_classrooms}
        
        # Find classrooms to add/update
        to_add = [c for c in current_classrooms if c['id'] not in existing_ids]
        to_update = [c for c in current_classrooms if c['id'] in existing_ids]
        to_remove = existing_ids - json_ids
        
        logger.info(f"Adding {len(to_add)} new classrooms")
        logger.info(f"Updating {len(to_update)} existing classrooms")
        if to_remove:
            logger.info(f"Removing {len(to_remove)} classrooms not in JSON")
        
        # Remove classrooms that are not in JSON (if force_update)
        if force_update and to_remove:
            for classroom_id in to_remove:
                db.query(Classroom).filter(Classroom.id == classroom_id).delete()
                # Also remove associated occupancy
                db.query(Occupancy).filter(Occupancy.classroom_id == classroom_id).delete()
        
        # Add new classrooms
        for classroom in to_add:
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
        
        # Update existing classrooms
        if force_update:
            for classroom in to_update:
                db_classroom = db.query(Classroom).filter(Classroom.id == classroom['id']).first()
                if db_classroom:
                    db_classroom.room_number = classroom['roomNumber']
                    db_classroom.building_id = classroom['buildingId']
                    db_classroom.faculty = classroom['faculty']
                    db_classroom.floor = classroom['floor']
                    db_classroom.capacity = classroom['capacity']
                    db_classroom.has_projector = classroom['hasProjector']
                    db_classroom.has_wifi = classroom['hasWifi']
                    db_classroom.has_power_outlets = classroom['hasPowerOutlets']
        
        # Initialize/update occupancy records for all classrooms
        for classroom in current_classrooms:
            db_occupancy = db.query(Occupancy).filter(Occupancy.classroom_id == classroom['id']).first()
            if not db_occupancy:
                db_occupancy = Occupancy(
                    id=f"occ_{classroom['id']}",
                    classroom_id=classroom['id'],
                    current_count=0,
                    detection_confidence=0.0,
                )
                db.add(db_occupancy)
            # If exists, keep existing occupancy data (don't reset)
        
        db.commit()
        final_count = db.query(Classroom).count()
        logger.info(f"Seeded {final_count} classrooms successfully (added: {len(to_add)}, updated: {len(to_update)})")
        
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


def init_database(force_update_classrooms: bool = False):
    """Initialize database with tables and seed data
    
    Args:
        force_update_classrooms: If True, update classrooms from JSON even if they already exist
    """
    create_tables()
    seed_classrooms(force_update=force_update_classrooms)
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

