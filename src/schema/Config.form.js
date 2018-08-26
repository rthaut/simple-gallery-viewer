

export default [
  {
    "type": "fieldset",
    "title": "Configuration Basics",
    "items": [
      {
        "key": "UUID",
        "title": "Unique ID",
        "readonly": true,
        "disableSuccessState": true
      },
      {
        "key": "Name",
        "title": "Configuration Name",
        "description": "The name of this configuration"
      },
      {
        "key": "Description",
        "title": "Configuration Description",
        "description": "Optional. Provide a description or overview for this configuration.",
        "type": "textarea",
        "disableSuccessState": true
      }
    ]
  },
  {
    "key": "ImageSelector",
    "title": "Image(s) Selector",
    "description": "The selector to identify all images on a page."
  },
  {
    "type": "fieldset",
    "title": "Site/Page URLs",
    "items": [
      {
        "key": "ApplyToAllURLs",
        "title": "Apply to All URL(s)",
        "description": "Disable this to specify URL pattern(s) for this configuration.",
        "disableSuccessState": true
      },
      {
        "type": "help",
        "helpvalue": "<div class=\"alert alert-info\"><p>Use the \"Applicable URLs\" section below to specify URLs (or patterns for URLs) for which this configuration should be enabled.</p></div>",
        "condition": "!model.ApplyToAllURLs"
      },
      {
        "key": "URLs",
        "title": "Applicable URLs",
        "add": "Add Another URL Pattern",
        "style": {
          "add": "btn-default"
        },
        "items": [
          {
            "key": "URLs[].Pattern",
            "title": "URL Pattern",
            "description": "A regular expression matching the URL(s) for which this configuration is applicable."
          }
        ],
        "condition": "!model.ApplyToAllURLs"
      }
    ]
  },
  {
    "type": "fieldset",
    "title": "Image URL Transformation",
    "items": [
      {
        "key": "TransformImageURLs",
        "title": "Transform Image URL(s)",
        "description": "Enable this to manipulate captured image URL(s).",
        "disableSuccessState": true
      },
      {
        "type": "help",
        "helpvalue": "<div class=\"alert alert-info\"><p>Use the \"Image URL Transformations\" section below to manipulate the captured URLs.</p><p>For example, if the oringal images are all thumbnails with <code>.thumb</code> inserted into their filenames (ex <code>MyFirstImage.thumb.jpg</code>), you can automatically change that to the full-sized image by using <code>.thumb</code> as the \"Search\" term and leaving the \"Replacement\" field empty.</p></div>",
        "condition": "model.TransformImageURLs"
      },
      {
        "key": "Transformations",
        "title": "Image URL Transformations",
        "add": "Add Another Image URL Transformation",
        "style": {
          "add": "btn-default"
        },
        "items": [
          {
            "key": "Transformations[].Search",
            "title": "Search",
            "description": "This is the part of the image URL that will be replaced."
          },
          {
            "key": "Transformations[].SearchRegExp",
            "title": "Regular Exppression",
            "description": "Enable this to use a regular expression as the \"Search\" term.",
            "disableSuccessState": true
          },
          {
            "key": "Transformations[].Replacement",
            "title": "Replacement",
            "description": "This is what will be used in place of the \"Search\" term."
          }
        ],
        "condition": "model.TransformImageURLs"
      }
    ]
  },
  {
    "type": "help",
    "helpvalue": "<hr/>"
  },
  {
    "type": "submit",
    "title": "Save Configuration",
    "style": "btn-success"
  }
];