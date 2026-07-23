{%
edition = page.get("edition", "free")  # the "edition" field, or "free" if the page omits it
product = page.get("product", "this product")  # the "product" field, or a generic fallback
if edition == "pro":
    plan = "Pro"
    note = "Every feature here is included."
else:
    plan = "Free"
    note = "Some features below require an upgrade."
%}
> **{% product %} — {% plan %} plan.** {% note %}
