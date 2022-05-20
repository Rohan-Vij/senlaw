# SenLaw API

[![Pylint](https://github.com/Rohan-Vij/senlaw/actions/workflows/pylint.yml/badge.svg)](https://github.com/Rohan-Vij/senlaw/actions/workflows/pylint.yml)

## Requirements

Install requirements by running `pip install -r requirements.txt`

Run with `python -m flask run --reload` (development environment). Uses OAuth2.

To update requirements.text, run the following commands in your terminal:
```python
> pip install pipreqs

> pipreqs --force
```

## Testing

Use [Insomnia](https://insomnia.rest/download) to test the API.

## Heroku
As Heroku is only intended to essentially deploy the root of a GitHub repository to a cloud application, some extra steps need to be taken in order to ensure that only the backend API gets deployed.

1. Install the Heroku CLI
2. Run `heroku login`
3. Run `heroku git:remote -a senlaw-api`
4. At the root directory (containing both the backend and frontend), run `git subtree push --prefix backend heroku master`
5. `cd` into the `backend` directory and run some of your usual commands:
    1. `cd backend`
    2. `git add .`
    3. `git commit -m "Commit message"`
6. Now, when pushing, MAKE SURE you add the `--force option`: `git push -u heroku master --force`
7. An error **will** occur - ignore that for now
8. Run `cd ..` to return to the parent directory
9. Once again, run `git subtree push --prefix backend heroku master`
10. Click on the application link provided. You're done!

#### Adding Heroku Environment Variables
Referencing the variables from your `.env` file, set variables by:
1. Make sure you are in the parent directory of the repository
2. Run `heroku config:set <var>=<value>`

