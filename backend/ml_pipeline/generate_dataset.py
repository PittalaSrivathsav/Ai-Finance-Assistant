import os
import random
import pandas as pd

CATEGORIES_DATA = {
    "Food": [
        "Swiggy dinner order", "Zomato food delivery", "Starbucks coffee latte",
        "McDonalds burger meal", "Dominos pizza delivery", "KFC fried chicken bucket",
        "Subway veggie sub sandwich", "Restaurant lunch with colleagues",
        "Supermarket grocery fruits vegetables", "Blinkit instant grocery delivery",
        "Zepto grocery order milk bread", "BigBasket monthly grocery supplies",
        "Bakery fresh cake and pastries", "Local tea and snacks stall",
        "Dinner at Italian restaurant", "Breakfast cafe coffee bagel",
        "Organic grocery store food items", "Gourmet cheese and pasta",
        "Dine in bill Chinese food restaurant", "Ice cream parlour dessert waffle",
        "Haldiram sweets snacks", "Burger King whopper meal", "Taco Bell tacos",
        "Pizza Hut dinner with family", "Biryani point dinner party"
    ],
    "Transport": [
        "Uber cab ride to airport", "Uber auto ride daily commute",
        "Ola cab ride home from office", "Metro card smart card recharge",
        "Bus ticket reservation online", "Petrol fuel HPCL station refill",
        "Diesel fuel full tank for car", "IRCTC train ticket booking reservation",
        "Indigo flight airline ticket travel", "FASTag toll plaza electronic recharge",
        "Airport parking lot fee ticket", "Car service periodic maintenance oil change",
        "Bike motorcycle wheel servicing", "Rapido bike taxi trip",
        "Taxi cab rental city tour", "Shell petrol pump fuel fill",
        "Indian oil corporation petrol", "Bharat Petroleum diesel fill",
        "Train ticket sleeper class booking", "Airport shuttle express bus"
    ],
    "Shopping": [
        "Amazon online shopping headphones purchase", "Flipkart electronics smart watch",
        "Myntra fashionable jacket clothes", "Zara cotton formal shirt",
        "H&M casual tshirts and jeans", "Nike running sports sneakers",
        "Apple iPad tablet and accessories", "Shopping mall department store",
        "Furniture wooden study desk chair", "Kitchen non stick pan cookware",
        "RayBan sunglasses eyewear store", "Leather wallet and belts",
        "Online makeup beauty cosmetics store", "Decathlon sports gym equipment",
        "Uniqlo winter wear jacket", "Levi's denim jeans store",
        "Titan wrist watch purchase", "Home decor wall painting frames"
    ],
    "Bills": [
        "Electricity power utility monthly bill", "High speed fiber broadband wifi bill",
        "Mobile phone prepaid recharge pack", "Airtel postpaid telecom bill",
        "Jio fiber optic broadband internet bill", "Municipal water supply pipeline bill",
        "Apartment society maintenance maintenance charges", "LPG cooking gas cylinder refill",
        "House monthly rent payment to landlord", "Home insurance annual premium",
        "Tata Power electricity bill", "Adani electricity bill payment",
        "Credit card annual membership fee bill", "Gas pipeline utility bill"
    ],
    "Entertainment": [
        "Netflix 4K UHD monthly subscription", "Spotify premium music subscription",
        "PVR Inox cinema movie tickets and popcorn", "BookMyShow concert event ticket",
        "Steam PC video game digital download", "PlayStation Plus yearly subscription",
        "Disney Hotstar VIP streaming", "Amusement theme park tickets",
        "Weekend club pub lounge drinks", "YouTube premium ad-free plan",
        "Apple Music annual plan", "Amazon Prime Video annual subscription",
        "Gaming tournament entry ticket", "Standup comedy show tickets"
    ],
    "Health": [
        "Pharmacy medicine tablets painkiller", "Apollo pharmacy multivitamins supplements",
        "Doctor clinic general consultation fee", "Dentist dental clinic checkup teeth cleaning",
        "Hospital health full body pathology test", "Cult Fit gym fitness center membership",
        "Yoga and meditation session fees", "Spectacles optical lenses eye checkup",
        "Physiotherapy treatment session", "MedPlus online medicine order",
        "Dermatologist skin care clinic fee", "Blood test lab report charges"
    ],
    "Education": [
        "Udemy online web development course", "Coursera AI machine learning specialization",
        "University college tuition exam fee", "Computer science algorithms textbook",
        "Kindle books self improvement reading", "Public speaking certification workshop",
        "AWS certification exam voucher", "School stationery pens notebooks supplies",
        "LinkedIn Learning monthly subscription", "Physics chemistry study material",
        "Language learning app subscription"
    ],
    "Pets": [
        "Pet food dog food pedigree kibble", "Cat food whiskas tuna wet food",
        "Pedigree adult dog meat gravy chicken rice", "Whiskas cat food ocean fish pouch",
        "Pet clinic vet consultation checkup fee", "Dog grooming shampoo trimming spa",
        "Pet shop puppy food treats snacks bones", "Royal Canin dog puppy dry food breed",
        "Pet supplies cat litter leash collar harness", "Veterinary hospital medicine for dog puppy",
        "Pet accessories dog bed cat toys chew bone", "Drools dog food pet treats puppy snacks",
        "Purina pet food supercoat pro plan", "Me-O cat food creamy treats salmon",
        "Aquarium fish food pellets pet care aquarium tank", "Bird cage seeds pet care supplies food",
        "Pet boarding day care kennel charges dog walking", "Pet vaccination injection rabies shot deworming",
        "Puppy kitten pet food nutrition pouch biscuits", "Vet animal clinic surgery medicine doctor"
    ],
    "Income": [
        "Monthly salary credited by employer", "Corporate performance bonus payment",
        "Freelance website UI design project payout", "Upwork freelance software contract",
        "Consulting advisory advisory fee credit", "Mutual fund stock market dividend",
        "Bank high yield savings account interest", "Cashback rewards reward points bonus",
        "Part time consulting project income", "Freelance technical writing payout"
    ]
}

def generate_dataset():
    records = []
    modifiers = [
        "", "payment", "online", "via UPI", "card payment", "store",
        "order", "expense", "bill", "subscription", "purchase", "charge"
    ]

    for category, examples in CATEGORIES_DATA.items():
        txn_type = "income" if category == "Income" else "expense"
        for ex in examples:
            records.append({"description": ex, "category": category, "transaction_type": txn_type})
            # Add synthetic variations
            for _ in range(8):
                mod = random.choice(modifiers)
                var_text = f"{ex} {mod}".strip()
                records.append({"description": var_text, "category": category, "transaction_type": txn_type})

    random.shuffle(records)
    df = pd.DataFrame(records)
    
    out_path = os.path.join(os.path.dirname(__file__), 'data', 'raw_transactions.csv')
    df.to_csv(out_path, index=False)
    print(f"Generated {len(df)} transactions in {out_path}")

if __name__ == '__main__':
    generate_dataset()
