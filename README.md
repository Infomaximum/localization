# Localization Library

The Localization library provides a convenient way to handle localization in your application, supporting multiple languages and plural forms. It allows you to easily retrieve localized strings and customize them based on provided parameters.

## Installation

You can install the Localization library via npm:

```bash
npm install @infomaximum/localization
```

## Usage

### Importing the Library

```javascript
import { Localization, ELanguages } from "@infomaximum/localization";
```

### Initializing Localization

To start using the Localization library, you need to create an instance of the `Localization` class:

```javascript
const localization = new Localization({ language: ELanguages.en });
```

You can specify the default language during initialization. If not provided, it will default to the language detected from the user's browser settings.

### Getting the Current Language

You can retrieve the current language set in the `Localization` instance:

```javascript
const currentLanguage = localization.getLanguage();
console.log("Current Language:", currentLanguage); // Output: "en" (for English)
```

### Retrieving Localized Strings

To retrieve a localized string, use the `getLocalized` method:

```javascript
const localizedString = localization.getLocalized({
  en: "Hello, World!",
  ru: "Привет, мир!",
});
console.log(localizedString); // Output: "Hello, World!"
```

You can also pass additional parameters to customize the localized string:

```javascript
const localizedString = localization.getLocalized(
  {
    en: (name) => `Hello, ${name}!`,
    ru: (name) => `Привет, ${name}!`,
  },
  { templateData: "John" }
);
console.log(localizedString); // Output: "Hello, John!"
```

### Plural Forms

The library supports plural forms for different languages. You can provide singular and plural forms for each language:

```javascript
const localizedString = localization.getLocalized(
  {
    en: { s: "1 item", p1: "%s items" },
    ru: { s: "1 предмет", p1: "%s предмета", p2: "%s предметов" },
  },
  { count: 5 }
);
console.log(localizedString); // Output: "5 items" (in English)
```

### Capitalization

You can specify whether the localized string should be capitalized:

```javascript
const localizedString = localization.getLocalized(
  {
    en: "hello, world!",
    ru: "привет, мир!",
  },
  { capitalized: true }
);
console.log(localizedString); // Output: "Hello, World!"
```

## Browser Language Detection

By default, the library detects the user's browser language to set the initial language. You can also explicitly set the language during initialization.

## Supported Languages

The library supports the following languages:

- English (en)
- Russian (ru)

## License

This library is released under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
