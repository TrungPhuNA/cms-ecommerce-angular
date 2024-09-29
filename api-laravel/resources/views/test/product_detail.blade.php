<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $product->name }} - Details</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container mt-5">
    <div class="row">
        <div class="col-md-4">
            <img src="{{ $product->avatar }}" class="img-fluid" alt="{{ $product->name }}">
        </div>
        <div class="col-md-8">
            <h2>{{ $product->name }}</h2>
            <p>{{ $product->description }}</p>
            <h4>Variants</h4>
            <ul class="list-group">
                @foreach($product->variants as $variant)
                    <li class="list-group-item">
                        <strong>Price:</strong> ${{ $variant->price }}<br>
                        <strong>Stock:</strong> {{ $variant->stock }} units<br>
                        <strong>Attributes:</strong>
                        <ul>
                            @foreach($variant->variantAttributes as $attribute)
                                <li>{{ $attribute->attributeValue->attribute->name }}: {{ $attribute->attributeValue->value }}</li>
                            @endforeach
                        </ul>
                    </li>
                @endforeach
            </ul>
        </div>
    </div>
</div>
</body>
</html>
