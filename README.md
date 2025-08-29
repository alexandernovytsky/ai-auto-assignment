# Mode Configuration validation

This feature will focus on a single level validation and analysis using AI.

## Validation
- The validation is done traditionally with pre-configured values ranges.
- ideally is to transform it to a configurable setting via a dedicated API EP. (checkout [modeConfigurationDefaults](./src/mode-configurations/mode-configuration.consts.ts))
- When Validation fails the flow will not continue to the analysis.

## Analysis:
- The analysis is done via AI using a system and a user prompt. 
- The system prompt defines the rules and the available configuration values and limitations. (checkout [levelModeConfigurationsSystemPromptTemplate](./src//mode-configurations/mode-configurations.prompts.ts))
- user prompt passes the configuration ot analyse
- system prompt includes pre-configured values of the specific related `mode-configurations` limitations and settings (check out [modeConfigurationsConfig](./src/mode-configurations/mode-configuration.consts.ts))
- ideally modeConfigurationsConfig would be configurable via API
- prompts to be configurable as well

## Project Structure

Centralise all the logic related to `mode-configurations` into on [folder](./src/mode-configurations), I find it more comfortable especially in big projects when there are plenty of files in the standard directories (routes, controllers, models, services, etc..)

## API Structure

- Keeping the API as close to RESTful as possible utilising nouns for names - `resource/action` --> `mode-configurations/validation`
- Addition of setting EP will be comfortable and RESTful `mode-configurations/settings`
- Allows comfortable extensibility later for multiple mode-configurations using RESTful approach `mode-configurations/validation/{id}` and `mode-configurations/settings/{id}` and CRUD via `mode-configurations` `mode-configurations/{id}`
  
## Improvements

- configurability of different settings via dedicated API
- configurability of prompts via dedicated API or settings API
- logging
- usage of a bundler
- configure linter better

## Setup

didn't find the "free tier" in OpenAi so usage Gemini instead, it's not the $ but ability to tests API without paying the $ in cases like this.

- create a free API key via google account at https://ai.google.dev/gemini-api/docs click "Get a Gemini API key" or directly from https://aistudio.google.com/app/apikey
- before running make sure to have the API key in `GEMINI_API_KEY` ENV var

### via project debug (ts)

- add .env file with `GEMINI_API_KEY=` to project
- use VSCode debugger to run (launch.json already included) 

### via docker


    docker build -t ai-validation-ms .
    docker run -e GEMINI_API_KEY=$GEMINI_API_KEY -p 3000:3000 ai-validation-ms


## Examples

There is an `tests.http` file with the requests used to generate the example results.
It can be used using REST Client extension in VSCode or copy them to Postman/curl.

### Balanced Level Config Example:

    ```json
    // REQUEST
    {
        "llmConfig": {
            "modelId": "gemini-2.0-flash"
        },
        "levelConfig": {
            "level": 25,
            "difficulty": "easy",
            "reward": 350,
            "timeLimit": 60
        }
    }

    // RESPONSE
    {
        "schema": {
            "isValid": true,
            "errors": []
        },
        "feedback": {
            "score": 95,
            "analysis": "The level is designated as 'easy' with a reward of 350 and a time limit of 60. The reward falls within the acceptable range (100-500) for 'easy' difficulty. The time limit of 60 also falls within the acceptable range (30-120) for 'easy' difficulty. Therefore, the level is well-balanced and appropriate for its intended difficulty. Level number 25 will need to be considered with total levels planned for the game in order to evaluate the level progression split.",
            "suggestions": []
        }
    }
    ```

### Unbalanced Level Config Example:

    ```json
    // REQUEST
    {
        "llmConfig": {
            "modelId": "gemini-2.0-flash"
        },
        "levelConfig": {
            "level": 999,
            "difficulty": "easy",
            "reward": 3400,
            "timeLimit": 20
        }
    }

    // RESPONSE
    {
        "schema": {
            "isValid": true,
            "errors": []
        },
        "feedback": {
            "score": 25,
            "analysis": "This level is highly unbalanced. While marked as 'easy,' the reward of 3400 is significantly outside the expected range of 100-500 for easy difficulty, placing it firmly in the 'hard' reward tier. The time limit of 20 seconds also leans towards a 'hard' difficulty, clashing with the 'easy' designation. Additionally, level 999 out of 1000 should be a hard level, rather than an easy level.",
            "suggestions": [
            "Change the difficulty to Hard.",
            "Reduce the reward to be within the 100-500 range if it is meant to be easy, or keep it as is if it meant to be hard.",
            "Increase the time limit to be within the 30-120 range if it is meant to be easy, or keep it as is if it meant to be hard."
            ]
        }
    }
    ```

### Validation Error LlmConfig


    ```json
    // REQUEST
    {
        "llmConfig": {
            "modelId": ""
        },
        "levelConfig": {
            "level": 600,
            "difficulty": "easy",
            "reward": 350,
            "timeLimit": 60
        }
    }
    // RESPONSE
    {
        "schema": {
            "isValid": false,
            "errors": [
                {
                    "field": "/modelId",
                    "message": "must be equal to one of the allowed values"
                }
            ]
        }
    }
    ```

### Validation Error LevelConfig - difficulty (enum)


    ```json
    // REQUEST
    {
        "llmConfig": {
            "modelId": "gemini-2.0-flash"
        },
        "levelConfig": {
            "level": 5,
            "difficulty": "incorrect",
            "reward": 500,
            "timeLimit": 60
        }
    }
    // RESPONSE
    {
        "schema": {
            "isValid": false,
            "errors": [
                {
                    "field": "/difficulty",
                    "message": "must be equal to one of the allowed values"
                }
            ]
        }
    }
    ```


### Validation Error LevelConfig - reward (number)


    ```json
    // REQUEST
    {
        "llmConfig": {
            "modelId": "gemini-2.0-flash"
        },
        "levelConfig": {
            "level": 5,
            "difficulty": "easy",
            "reward": 1274987,
            "timeLimit": 60
        }
    }
    // RESPONSE
    {
        "schema": {
            "isValid": false,
            "errors": [
                {
                    "field": "/reward",
                    "message": "must be <= 5000"
                }
            ]
        }
    }
    ```