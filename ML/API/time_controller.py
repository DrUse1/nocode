import pytz
from datetime import datetime, date, timedelta
import random

def getRandomHour():
    # Generate a random hour, minute, and second
    random_hour = random.randint(0, 23)
    random_minute = random.randint(0, 59)
    random_second = random.randint(0, 59)

    # Format the time
    formatted_time = f"{random_hour:02d}:{random_minute:02d}:{random_second:02d}"

    return formatted_time

def getCurrentDate():
    x = date.today()
    x = x.strftime("%B %d, %Y")
    return str(x)

def fullDate():
    # Generate a random date in 2023
    random_date = getCurrentDate()


    # Get the random hour
    random_hour = getRandomHour()

    return random_date + ' ' + random_hour

print(fullDate())