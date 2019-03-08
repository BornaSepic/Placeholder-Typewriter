# Placeholder-Typewriter
Pure JavaScript plugin for animating placeholders on input elements

### How to use:

1. Include the typewriter.js script into your file before the </body> tag.
2. Call the typewriter with the ``` new Typewriter ``` constructor function
3. Enjoy :shipit:

### API
Calling a new instance of the typewriter:
```
new Typewriter('#zipcodeInput', ['Input Your Zip Code', 'eg. 93108'], {writeDelay: 200});
```
The ``` new Typewriter ``` accepts three arguments
1. A querySelector to select the input field
2. An array of strings to be typed out in the selected input field
3. An options settings object to overwrite default settings

#### Settings
- writeDelay => Delay between each letter is written (default: 60ms)                                                              
--expecting a number of miliseconds
- deleteDelay => Delay between each letter is removed (default: 40ms)                                                              
--expecting a number of miliseconds
- holdOnceWritten => Delay once the current phrase has been fully displayed (default: 1000ms)                                                              
--expecting a number of miliseconds
- holdOnceDeleted => Delay once the current phrase has been fully deleted (default: 1000ms)                                                              
--expecting a number of miliseconds
