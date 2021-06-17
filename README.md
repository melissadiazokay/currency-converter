# Currency Calculator

##### A basic currency converter using the [Swop.cx REST API](https://swop.cx/documentation/rest#quickstart).
## Stack
* **Larvel PHP v8.46.0**
* **Vue.js v3.1.1** 
* **SQLite v3.35.5**
### Front-end Dependencies
* [**Vue 3**](https://v3.vuejs.org/)
* [**Bootstrap 5**](https://getbootstrap.com/)
* [**Font Awesome 4**](https://fontawesome.com/v4.7/icons/)
#### Dev Dependencies
* Composer

## Features
* Convert between a **base currency**** and up to 10 **quote currencies**.
* Persist results to database and access by email address.
* View the different exchange rates including best exchange rate among the chosen quote currencies.
** Due to [limits of API 'free tier'](https://swop.cx/pricing), the only base currency currently available is the **Euro (EUR)**

## Installation
Install [composer](https://getcomposer.org/)
1. Clone Repository `git clone https://github.com/melissadiazokay/currency-converter.git`
2. `cd currency-converter`
2. Run `composer install`
3. You will need to update the absolute path to the SQLite database file (`.env` on `line 13`)
5. Run `php artisan serve`