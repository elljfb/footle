# Adding an article

Create a Markdown file in this folder. Its filename becomes the article URL slug, so `my-new-guide.md` is published at `/articles/my-new-guide`.

Add the required metadata at the top as YAML frontmatter, followed by the article body in Markdown:

```md
---
title: "My New Football Guide"
description: "A short search and sharing description."
category: "Football guide"
publishedAt: "2026-10-22"
author: "Footle Editorial Team"
excerpt: "A short summary shown on the article card."
image: "/images/articles/my-new-guide.jpg"
imageAlt: "Describe the featured image"
featured: true
---

Introductory paragraph.

## First section

Article text goes here. Use normal Markdown headings, paragraphs, lists, links, and emphasis.

![Describe an image in the article](/images/articles/example.jpg)
```

Put image files in `public/images/articles/` and refer to them from Markdown with a leading slash, such as `/images/articles/example.jpg`. The `image` and `imageAlt` fields are optional and set the article's featured image; Markdown image syntax adds images anywhere in the body. Only one article should normally have `featured: true`; otherwise, the featured article is selected by publication date.
