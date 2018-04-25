import csv
import json

# Path to CSV data file
CSV_FILE = "Geregistreerde_criminaliteit.csv"

def convert(file, delimiter):
    """converts a raw CSV file to a JSON-like object"""

    # Open CSV file, and safely close it when we're done
    opened_file = open(file)

    # Read the CSV data
    my_data = csv.reader(opened_file, delimiter=delimiter)

    # Setup an empty list
    converted_data = []

    # Skip over the first line of the file for the headers
    headers = next(my_data)

    # Iterate over each row of the csv file, zip together field -> value
    for row in my_data:
        converted_data.append(dict(zip(headers, row)))

    # Close the CSV file
    opened_file.close()

    return converted_data


def main():
    # Call the convert function with the necessary arguments
    new_data = convert(CSV_FILE, ";")

    catagories = {}

    catagories.update(dict(catagories=new_data))

    with open('data.json', 'w') as outfile:
        json.dump(catagories, outfile)

if __name__ == "__main__":
    main()
