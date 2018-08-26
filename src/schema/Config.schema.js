

export default {
  "type": "object",
  "properties": {
    "UUID": {
      "type": "string"
    },
    "Name": {
      "type": "string",
      "minLength": 4
    },
    "Description": {
      "type": "string"
    },
    "Enabled": {
      "type": "boolean",
      "default": true
    },
    "ApplyToAllURLs": {
      "type": "boolean",
      "default": true
    },
    "URLs": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "Pattern": {
            "type": "string"
          }
        },
        "required": ["Pattern"]
      }
    },
    "ImageSelector": {
      "type": "string"
    },
    "TransformImageURLs": {
      "type": "boolean",
      "default": false
    },
    "Transformations": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "Search": {
            "type": "string"
          },
          "SearchRegExp": {
            "type": "boolean",
            "default": false
          },
          "Replacement": {
            "type": "string"
          }
        },
        "required": ["Search", "Replacement"]
      }
    }
  },
  "required": ["Name", "UUID", "ImageSelector"]
};