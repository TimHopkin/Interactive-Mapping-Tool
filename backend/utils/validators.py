import re
from werkzeug.security import check_password_hash

def validate_email(email):
    """
    Validate an email address
    
    Args:
        email: Email address to validate
        
    Returns:
        True if valid, False otherwise
    """
    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'$'
    return bool(re.match(pattern, email))

def validate_password(password):
    """
    Validate a password for minimum security requirements
    
    Args:
        password: Password to validate
        
    Returns:
        (valid, message) tuple
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter"
    
    if not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter"
    
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one digit"
    
    return True, "Password is valid"

def validate_coordinates(lon, lat):
    """
    Validate geographic coordinates
    
    Args:
        lon: Longitude value
        lat: Latitude value
        
    Returns:
        True if valid, False otherwise
    """
    try:
        lon_float = float(lon)
        lat_float = float(lat)
        
        if not (-180 <= lon_float <= 180):
            return False
        
        if not (-90 <= lat_float <= 90):
            return False
        
        return True
    except (ValueError, TypeError):
        return False

def validate_file_extension(filename, allowed_extensions):
    """
    Validate file extension
    
    Args:
        filename: File name to validate
        allowed_extensions: List of allowed extensions
        
    Returns:
        True if valid, False otherwise
    """
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    return ext in allowed_extensions

def sanitize_string(value):
    """
    Sanitize a string for safe use in queries
    
    Args:
        value: String to sanitize
        
    Returns:
        Sanitized string
    """
    if not isinstance(value, str):
        return value
    
    # Remove any potential SQL injection or script injection characters
    sanitized = re.sub(r'[\'";><&]', '', value)
    return sanitized

def validate_bbox(bbox):
    """
    Validate a bounding box
    
    Args:
        bbox: Bounding box as (minx, miny, maxx, maxy) tuple
        
    Returns:
        True if valid, False otherwise
    """
    if not isinstance(bbox, (list, tuple)) or len(bbox) != 4:
        return False
    
    try:
        minx, miny, maxx, maxy = map(float, bbox)
        
        # Check longitude bounds
        if not (-180 <= minx <= 180) or not (-180 <= maxx <= 180):
            return False
        
        # Check latitude bounds
        if not (-90 <= miny <= 90) or not (-90 <= maxy <= 90):
            return False
        
        # Check that min is less than max
        if minx >= maxx or miny >= maxy:
            return False
        
        return True
    except (ValueError, TypeError):
        return False