import requests
import random
import json
from datetime import datetime, timedelta

# Replace with your API endpoint URL
GET_UCL_API = 'http://localhost:3000/api/room-management/'  # Replace with actual GET UCL API URL
POST_MEASUREMENT_API = 'http://localhost:3000/api/dust-measurements/'  # Replace with actual POST API URL to create dust measurement

# Fetch UCL data from API
def fetch_ucl_data():
    response = requests.get(GET_UCL_API)
    if response.status_code == 200:
        ucl_data = response.json()  # Assuming the response is in JSON format
        print("Successfully fetched UCL data:")
        print(ucl_data)  # Print the entire UCL data to inspect its structure
        return ucl_data
    else:
        raise Exception(f"Failed to fetch UCL data. Status code: {response.status_code}")

def generate_um_values(ucl, previous_values=None, exceedance_probability=0.1):
    """
    ฟังก์ชันสุ่มค่า UM โดยใช้ Normal Distribution
    และเพิ่มโอกาสการเกิน (exceedance) 0.001%
    """
    def random_um(mean, std_dev, ucl_value):
        value = random.gauss(mean, std_dev)  # สุ่มค่าแบบ Normal Distribution
        return max(0, min(value, ucl_value * 1.5))  # ป้องกันค่า < 0 หรือเกินขีดจำกัด 1.5 เท่า

    # กำหนดค่าเฉลี่ย (mean) และส่วนเบี่ยงเบนมาตรฐาน (std_dev)
    base_mean = {
        'um01': ucl['ucl01'] * 0.7,
        'um03': ucl['ucl03'] * 0.7,
        'um05': ucl['ucl05'] * 0.7,
    }
    std_dev = {
        'um01': ucl['ucl01'] * 0.2,
        'um03': ucl['ucl03'] * 0.2,
        'um05': ucl['ucl05'] * 0.2,
    }

    # ถ้าค่าวัดก่อนหน้าไม่เกิน -> ลดโอกาสสุ่มเกิน
    if previous_values and all(previous_values[k] <= ucl[k.replace('um', 'ucl')] for k in previous_values):
        base_mean = {k: v * 0.9 for k, v in base_mean.items()}  # ลด mean ลง
        std_dev = {k: v * 0.5 for k, v in std_dev.items()}  # ลด std_dev ลง

    # สุ่มค่า UM สำหรับแต่ละประเภทฝุ่น
    um_values = {
        'um01': int(random_um(base_mean['um01'], std_dev['um01'], ucl['ucl01'])),
        'um03': int(random_um(base_mean['um03'], std_dev['um03'], ucl['ucl03'])),
        'um05': int(random_um(base_mean['um05'], std_dev['um05'], ucl['ucl05'])),
    }

    # เพิ่มโอกาสการเกินขีดจำกัด
    if random.random() < exceedance_probability:  # 0.001% โอกาสเกิน
        # สุ่มค่าเกินขีดจำกัด (exceeding the UCL)
        um_values['um01'] = random.randint(ucl['ucl01'] + 1, ucl['ucl01'] * 2)  # เกิน ucl01
        um_values['um03'] = random.randint(ucl['ucl03'] + 1, ucl['ucl03'] * 2)  # เกิน ucl03
        um_values['um05'] = random.randint(ucl['ucl05'] + 1, ucl['ucl05'] * 2)  # เกิน ucl05

    return um_values

# Generate mock data based on the UCL data

def generate_mock_data(ucl_data, room='Room1'):
    areas = ['Clean booth']
    locations = [f"{i:03d}" for i in range(1, 21)]
    start_date = datetime(2025, 1, 1, 7, 0)
    end_date = datetime(2025, 2, 27, 23, 59)

    mock_data = []

    current_date = start_date

    while current_date <= end_date:
        print(f"\n=== Start measuring for date: {current_date.date()} ===")

        measurement_time = current_date  # เวลาปัจจุบัน เริ่ม 07:00 ของวันใหม่

        for area in areas:
            for location in locations:
                # ดึง UCL ของ room + area นี้
                ucl = next((entry for entry in ucl_data['data'] if entry['room'] == room and entry['area'] == area), None)

                if not ucl:
                    print(f"No UCL data for {room}_{area}, skip location {location}")
                    continue

                for count in range(1, 4):  # สูงสุด 3 รอบ
                    um_values = {
                        'um01': random.randint(0, ucl['ucl01'] * 2),  # สมมติสุ่มได้เกิน UCL ได้
                        'um03': random.randint(0, ucl['ucl03'] * 2),
                        'um05': random.randint(0, ucl['ucl05'] * 2)
                    }

                    entry = {
                        'measurement_datetime': measurement_time.isoformat(),
                        'room': room,
                        'area': area,
                        'location_name': location,
                        'count': count,
                        'um01': um_values['um01'],
                        'um03': um_values['um03'],
                        'um05': um_values['um05'],
                        'running_state': random.randint(0, 1),
                        'alarm_high': 1 if count == 3 else 0,
                    }
                    mock_data.append(entry)

                    print(f"Measured {room}_{area}_{location} at {measurement_time}, count {count}, um: {um_values}")

                    # ถ้าค่าฝุ่นไม่เกิน ให้จบการวัดของจุดนี้ทันที
                    if all(um_values[k] <= ucl[k.replace('um', 'ucl')] for k in ['um01', 'um03', 'um05']):
                        print(f"No exceedance at {room}_{area}_{location}, moving to next location.")
                        # เพิ่มเวลาไปจุดถัดไปทันที (สมมติว่าใช้เวลา 1 นาทีต่อการย้ายจุด)
                        measurement_time += timedelta(minutes=1)
                        break
                    else:
                        print(f"Exceedance found at {room}_{area}_{location}, measuring again.")
                        # วัดรอบถัดไปในอีก 1 นาที
                        measurement_time += timedelta(minutes=1)

        # ข้ามไปวันถัดไปเมื่อครบทุก location (เริ่ม 7 โมงเช้าวันใหม่)
        current_date = datetime(current_date.year, current_date.month, current_date.day, 7, 0) + timedelta(days=1)

    return mock_data



# POST the generated mock data to create measurements
def create_dust_measurements(mock_data):
    print(f"Preparing to post {len(mock_data)} mock measurements.")
    for entry in mock_data:
        response = requests.post(POST_MEASUREMENT_API, json=entry)
        if response.status_code == 201:
            print(f"Successfully created dust measurement: {entry}")
        else:
            print(f"Failed to create dust measurement: {response.status_code}, {response.text}")

# Main execution
if __name__ == "__main__":
    try:
        # Fetch UCL data from your API
        ucl_data = fetch_ucl_data()

        # Generate mock dust measurement data
        mock_data = generate_mock_data(ucl_data)
        print(json.dumps(mock_data, indent=4))

        # POST the mock data to create dust measurements in the database
        create_dust_measurements(mock_data)

        print("Successfully created mock dust measurements")

    except Exception as e:
        print(f"Error: {e}")
