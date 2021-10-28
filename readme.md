# Introduction
The point of this project is to showcase my abilities to develop a backend server that can satisfy the needs of the client.

"Carl-Karts", is going to manage the World Kart Championship in his circuit, and
they will need a system display to classify the pilots.
He has developed a web application where you can see the overall ranking of all the drivers
who have participated in the 10 races that made up this championship. But they need a REST
API to provide to the web all this information

The REST API must publish, at least, the following endpoints:
* General classification (all races) (Driver - Total time - Points)
* Individual race classification (Driver - Total time - Best lap - Points)
* Drivers details (Race - Total time - Best lap - Points)
* Import data from JSON (Pilots list with their data)
* Export data to JSON (Pilots list with their data)
* Add pilot (Pilot data)
* Add Race (Race data)
* Add Lap (Pilot - Time)

# Database design

The database that I chose was MongoDB along with Mongoose mainly because I hadn't had the opportunity to design a database with these tools. I think it does the job but maybe I was a little biased and thought more in a SQL-manner than I should have had.

![](https://i.imgur.com/grknmKf.png)

Now I'd like to explain the reason for this approach. I wanted to keep a record of the drivers that ran the race in a different array in order to be able to identify if a given driver has driven the race without the need to loop over all the laps.

Also I needed to track which lap belongs to which driver in order to be able to determinate the final ranking of each driver at the end of the race.

# System architecture

![](https://i.imgur.com/8omUN0c.png)

This is the architecture of the system, basically we use different layers to keep the code organize and easy to read.

# Setup the project

For this project to run properly we need to follow these steps:
* MongoDB server running on the machine.
* Clone this repository

    `git clone git@github.com:rjrodriguezalvarez97/technical-test-devaway-ricardo.git`
* Install dependencies `npm i`
* Start the server `npm run dev`
* \* Optionally we can run the test `npm test`

# API usage


## Get general classification

Endpoint: `/ranking`
HTTP Verb: `GET`
Expected output:
```json
[
    {
        "driver": {
            "_id": "5fd7dbd89297af55072644c8",
            "name": "White Elliott",
            "picture": "http://placehold.it/64x64",
            "age": 34,
            "team": "FURNAFIX",
            "__v": 0
        },
        "totalTime": 64281.571,
        "totalTimeString": "17:51:21.571",
        "points": 91
    },
    {
        "driver": {
            "_id": "5fd7dbd8a26c54361e216d1d",
            "name": "Kitty Farmer",
            "picture": "http://placehold.it/64x64",
            "age": 34,
            "team": "OTHERSIDE",
            "__v": 0
        },
        "totalTime": 64450.571,
        "totalTimeString": "17:54:10.571",
        "points": 81
    },
    ...
]
```
Error output:
```json
{
    "code": 500,
    "message": "Couldn't retrieve championship ranking"
}
```


## Get individual race classification

Endpoint: `/ranking/race?name=Race 6`

HTTP Verb: `GET`

Expected output:
```json
{
    "_id": "617685026dfec69763b64668",
    "name": "Race 6",
    "ranking": [
        {
            "driver": {
                "_id": "5fd7dbd8425291733653f7a1",
                "name": "Perkins Guerrero",
                "picture": "http://placehold.it/64x64",
                "age": 32,
                "team": "PATHWAYS",
                "__v": 0
            },
            "totalTime": 5736.47,
            "totalTimeString": "01:35:36.470",
            "bestLap": "00:08:13.516",
            "points": 25
        },
        {
            "driver": {
                "_id": "5fd7dbd8a13b7e886de9dcd1",
                "name": "Vang Foreman",
                "picture": "http://placehold.it/64x64",
                "age": 32,
                "team": "CANDECOR",
                "__v": 0
            },
            "totalTime": 5994.326,
            "totalTimeString": "01:39:54.326",
            "bestLap": "00:08:04.102",
            "points": 18
        },
        ...
    ]
}
```
Error output:
```json
    {
        "code": 400,
        "message": "Missing race name on query parameter"
    }
```
```json
    {
        "code": 404,
        "message": "Race not found"
    }
```

## Get Driver details

Endpoint: `/ranking/driver/:id`

HTTP Verb: `GET`

Expected output:
```json
[
{
    "driver": {
        "_id": "5fd7dbd89297af55072644c8",
        "name": "White Elliott",
        "picture": "http://placehold.it/64x64",
        "age": 34,
        "team": "FURNAFIX",
        "__v": 0
    },
    "races": [
        {
            "name": "Race 0",
            "totalTime": 6302.55,
            "totalTimeString": "01:45:02.550",
            "bestLap": "00:08:11.010",
            "points": 15
        },
        {
            "name": "Race 1",
            "totalTime": 6459.359,
            "totalTimeString": "01:47:39.359",
            "bestLap": "00:08:15.365",
            "points": 6
        },
        ...
]
```
Error output:
```json
    {
        "code": 400,
        "message": "Missing driver id"
    }
```
```json
    {
        "code": 404,
        "message": "Driver not found"
    }
```


## Import data

Endpoint: `/import`

HTTP Verb: `POST`

Expected output:
```json
{
    "message": "Data imported succesfully",
    "docs": [
        {
            "name": "Cooke Rivers",
            "picture": "http://placehold.it/64x64",
            "age": 23,
            "team": "PROTODYNE",
            "_id": "5fd7dbd8ce3a40582fb9ee6b",
            "__v": 0
        },
        {
            "name": "May Valentine",
            "picture": "http://placehold.it/64x64",
            "age": 30,
            "team": "CUBICIDE",
            "_id": "5fd7dbd84c10103c125fc1af",
            "__v": 0
        },
        {
            "name": "Vang Foreman",
            "picture": "http://placehold.it/64x64",
            "age": 32,
            "team": "CANDECOR",
            "_id": "5fd7dbd8a13b7e886de9dcd1",
            "__v": 0
        },
        {
            "name": "Guerrero Henry",
            "picture": "http://placehold.it/64x64",
            "age": 24,
            "team": "OPPORTECH",
            "_id": "5fd7dbd8d37bc572f2d66fc3",
            "__v": 0
        },
        ...
]
```
Error output:
```json
    {
        "code": 500,
        "message": "Import failed. Try again later"
    }
```

## Export data

Endpoint: `/import`

HTTP Verb: `POST`

Expected output:
```json
[
    {
        "_id": "5fd7dbd84c10103c125fc1af",
        "name": "May Valentine",
        "team": "CUBICIDE",
        "age": 30,
        "picture": "http://placehold.it/64x64",
        "races": [
            {
                "name": "Race 0",
                "laps": [
                    {
                        "time": "00:08:39.615"
                    },
                    {
                        "time": "00:08:35.276"
                    },
                    {
                        "time": "00:12:36.647"
                    },
                    {
                        "time": "00:09:47.938"
                    },
                    {
                        "time": "00:12:09.586"
                    },
                    {
                        "time": "00:12:56.577"
                    },
                    {
                        "time": "00:12:33.757"
                    },
                    {
                        "time": "00:11:48.934"
                    },
                    {
                        "time": "00:12:04.329"
                    },
                    {
                        "time": "00:10:43.859"
                    }
                ]
            }
            ...
        ]
    }
    ...
]
```
Error output:
```json
    {
        "code": 500,
        "message": "Import failed. Try again later"
    }
```

## Add lap

Endpoint: `/race/:id/laps`

HTTP Verb: `POST`

Body :
```json
{
    "driver": "617a78c53ad0b1a1be9c1904",
    "time": "00:10:22.444"
}
```

Expected output:
```json
{
    "_id": "617a70b0003109eccb439bcd",
    "name": "Race 0",
    "drivers": [
        "617a78c53ad0b1a1be9c1904",
        ...
    ],
    "laps": [
        {
            "driver": "617a78c53ad0b1a1be9c1904",
            "time": "10:00:22.444",
            "_id": "617a810681cbc52ba06be144"
        },
        ...
    ],
    "__v": 1
}
```
Error output:
```json
    {
        "code": 400,
        "message": "driver is required"
    }
```
```json
    {
        "code": 400,
        "message": "time is required"
    }
```
```json
    {
        "code": 404,
        "message": "Race not found"
    }
```
```json
    {
        "code": 404,
        "message": "Driver not found"
    }
```

# Improvements

## Effiency
At the moment, the points and the timers are calculated everytime a request is made, this is not efficient at all.

Perhaps the points and timers should be calculated once when the data is being imported and stored in the database and updated when a new entry is added(race, lap, driver). Maybe it would need a redesign of the database but I don't think it would be too large.

## Testing
Some REST testing could be nice, in order to check if the controller is doing the work properly