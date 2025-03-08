import requests
import random
import json
from datetime import datetime, timedelta

# Replace with your actual API URLs
GET_UCL_API = 'http://localhost:5000/api/room-management/'  # Replace with actual GET UCL API URL
POST_MEASUREMENT_API = 'http://localhost:5000/api/dust-measurements/'  # Replace with actual POST API URL

# Fetch UCL data from API
def fetch_ucl_data():
    response = requests.get(GET_UCL_API)
    if response.status_code == 200:
        ucl_data = response.json()
        print("Successfully fetched UCL data:")
        print(ucl_data)
        return ucl_data
    else:
        raise Exception(f"Failed to fetch UCL data. Status code: {response.status_code}")

# Function to generate UM values using Normal Distribution with exceedance probability
def generate_um_values(ucl, previous_values=None, exceedance_probability=0.1):
    def random_um(mean, std_dev, ucl_value):
        value = random.gauss(mean, std_dev)
        return max(0, min(value, ucl_value * 1.5))  # Clamp to [0, 1.5 * UCL]

    # Base means and standard deviations
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

    # If previous values exist and were within limits, lower the mean and std_dev
    if previous_values and all(previous_values[k] <= ucl[k.replace('um', 'ucl')] for k in previous_values):
        base_mean = {k: v * 0.9 for k, v in base_mean.items()}
        std_dev = {k: v * 0.5 for k, v in std_dev.items()}

    # Generate normal-distributed UM values
    um_values = {
        'um01': int(random_um(base_mean['um01'], std_dev['um01'], ucl['ucl01'])),
        'um03': int(random_um(base_mean['um03'], std_dev['um03'], ucl['ucl03'])),
        'um05': int(random_um(base_mean['um05'], std_dev['um05'], ucl['ucl05'])),
    }

    # Random chance to exceed UCL
    if random.random() < exceedance_probability:
        um_values['um01'] = random.randint(ucl['ucl01'] + 1, int(ucl['ucl01'] * 1.5))
        um_values['um03'] = random.randint(ucl['ucl03'] + 1, int(ucl['ucl03'] * 1.5))
        um_values['um05'] = random.randint(ucl['ucl05'] + 1, int(ucl['ucl05'] * 1.5))

    return um_values

# Generate mock data using the realistic UM generation logic
def generate_mock_data(ucl_data, room='Room3'):
    areas = ['Cold Room']
    locations = [f"{i:03d}" for i in range(1, 11)]
    start_date = datetime(2025, 1, 1, 7, 0)
    end_date = datetime(2025, 3, 19, 23, 59)

    mock_data = []

    current_date = start_date

    while current_date <= end_date:
        print(f"\n=== Start measuring for date: {current_date.date()} ===")

        measurement_time = current_date

        for area in areas:
            for location in locations:
                ucl = next((entry for entry in ucl_data['data'] if entry['room'] == room and entry['area'] == area), None)

                if not ucl:
                    print(f"No UCL data for {room}_{area}, skip location {location}")
                    continue

                previous_um_values = None  # Reset at each new location

                alarm_flag = False  # Track exceedance across all counts

                for count in range(1, 4):
                    # Generate UM values
                    um_values = generate_um_values(ucl, previous_values=previous_um_values)

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
                        'alarm_high': 0,
                    }

                    if count == 3 and any(um_values[k] > ucl[k.replace('um', 'ucl')] for k in ['um01', 'um03', 'um05']):
                        entry['alarm_high'] = 1

                    mock_data.append(entry)

                    if all(um_values[k] <= ucl[k.replace('um', 'ucl')] for k in ['um01', 'um03', 'um05']):
                        break

                    print(f"Measured {room}_{area}_{location} at {measurement_time}, count {count}, um: {um_values}, alarm_high: {entry['alarm_high']}")

                    # Update previous UM values for next iteration
                    previous_um_values = um_values

                    # Stop measuring this location if values are within limits
                    if all(um_values[k] <= ucl[k.replace('um', 'ucl')] for k in ['um01', 'um03', 'um05']):
                        print(f"No exceedance at {room}_{area}_{location}, moving to next location.")
                        measurement_time += timedelta(minutes=1)
                        break
                    else:
                        print(f"Exceedance found at {room}_{area}_{location}, measuring again.")
                        measurement_time += timedelta(minutes=1)

        # Move to next day at 7:00 AM
        current_date = datetime(current_date.year, current_date.month, current_date.day, 7, 0) + timedelta(days=1)

    return mock_data

# POST generated mock data to the API
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
        ucl_data = fetch_ucl_data()
        mock_data = generate_mock_data(ucl_data)
        print(json.dumps(mock_data, indent=4))
        create_dust_measurements(mock_data)
        print("Successfully created mock dust measurements")
    except Exception as e:
        print(f"Error: {e}")
