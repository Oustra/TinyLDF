import requests
import urllib.parse

# API endpoint base URL
api_base_url = "https://tinyldf.ey.r.appspot.com/_ah/api/myApi/v1/addTriplet"

# Path to your TTL file
ttl_file = "Netflix_data.ttl"

# Read and process the file
with open(ttl_file, "r") as file:
    for line in file:
        if line.strip():  # Skip empty lines
            parts = line.strip().split(" ", 2)  # Split into subject, predicate, object
            if len(parts) == 3:
                subject, predicate, obj = parts
                obj = obj[:-1]  # Remove the trailing "."
                
                # URL encode each parameter, using safe='' to encode forward slashes
                encoded_subject = urllib.parse.quote(subject, safe='')
                encoded_predicate = urllib.parse.quote(predicate, safe='')
                encoded_object = urllib.parse.quote(obj, safe='')
                
                # Construct the full URL
                full_url = f"{api_base_url}/{encoded_subject}/{encoded_predicate}/{encoded_object}"
                
                # Call the API
                response = requests.get(full_url)
                print(f"Processed: {subject} {predicate} {obj}, Status: {response.status_code}")
                
                if response.status_code != 200:
                    print(f"Error URL: {full_url}")
