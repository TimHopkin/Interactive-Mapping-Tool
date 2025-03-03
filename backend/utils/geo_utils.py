from shapely.geometry import Point, LineString, Polygon, MultiPolygon, shape
from shapely.ops import transform
import pyproj
from functools import partial
import math

def reproject_geometry(geom, from_epsg, to_epsg):
    """
    Reproject a geometry from one coordinate system to another
    
    Args:
        geom: Shapely geometry
        from_epsg: Source EPSG code (e.g., 4326 for WGS84)
        to_epsg: Target EPSG code (e.g., 3857 for Web Mercator)
        
    Returns:
        Reprojected geometry
    """
    project = partial(
        pyproj.transform,
        pyproj.Proj(f'EPSG:{from_epsg}'),
        pyproj.Proj(f'EPSG:{to_epsg}')
    )
    return transform(project, geom)

def calculate_area(geom, in_square_km=False):
    """
    Calculate the area of a geometry
    
    Args:
        geom: Shapely geometry
        in_square_km: If True, return area in square kilometers
        
    Returns:
        Area measurement
    """
    # If the geometry is in WGS84 (lat/lon), reproject to a projected CRS
    # for accurate area calculations
    if isinstance(geom, (Polygon, MultiPolygon)):
        # Determine a reasonable UTM zone for the geometry's centroid
        utm_zone = get_utm_zone(geom.centroid.x, geom.centroid.y)
        utm_epsg = get_utm_epsg(geom.centroid.y, utm_zone)
        
        # Reproject to UTM
        geom_utm = reproject_geometry(geom, 4326, utm_epsg)
        
        # Calculate area
        area = geom_utm.area
        
        # Convert to square km if requested
        if in_square_km:
            area = area / 1_000_000
        
        return area
    else:
        return 0

def calculate_length(geom, in_km=False):
    """
    Calculate the length of a geometry
    
    Args:
        geom: Shapely geometry
        in_km: If True, return length in kilometers
        
    Returns:
        Length measurement
    """
    if isinstance(geom, LineString):
        # Determine a reasonable UTM zone for the geometry's centroid
        utm_zone = get_utm_zone(geom.centroid.x, geom.centroid.y)
        utm_epsg = get_utm_epsg(geom.centroid.y, utm_zone)
        
        # Reproject to UTM
        geom_utm = reproject_geometry(geom, 4326, utm_epsg)
        
        # Calculate length
        length = geom_utm.length
        
        # Convert to km if requested
        if in_km:
            length = length / 1000
        
        return length
    else:
        return 0

def get_utm_zone(longitude, latitude):
    """
    Get the UTM zone for a given longitude and latitude
    
    Args:
        longitude: Longitude in decimal degrees
        latitude: Latitude in decimal degrees
        
    Returns:
        UTM zone number
    """
    zone = int((longitude + 180) / 6) + 1
    return zone

def get_utm_epsg(latitude, zone):
    """
    Get the EPSG code for a UTM zone
    
    Args:
        latitude: Latitude in decimal degrees
        zone: UTM zone number
        
    Returns:
        EPSG code for the UTM zone
    """
    if latitude >= 0:
        return 32600 + zone  # Northern hemisphere
    else:
        return 32700 + zone  # Southern hemisphere

def haversine_distance(lon1, lat1, lon2, lat2, in_km=True):
    """
    Calculate the great circle distance between two points
    
    Args:
        lon1: Longitude of point 1
        lat1: Latitude of point 1
        lon2: Longitude of point 2
        lat2: Latitude of point 2
        in_km: If True, return distance in kilometers, otherwise in meters
        
    Returns:
        Distance between the points
    """
    # Convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(math.radians, [lon1, lat1, lon2, lat2])
    
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    r = 6371  # Radius of Earth in kilometers
    
    distance = c * r
    
    # Convert to meters if requested
    if not in_km:
        distance = distance * 1000
    
    return distance

def geojson_to_shapely(geojson):
    """
    Convert GeoJSON to Shapely geometry
    
    Args:
        geojson: GeoJSON object or string
        
    Returns:
        Shapely geometry
    """
    return shape(geojson)

def simplify_geometry(geom, tolerance=0.001):
    """
    Simplify a geometry to reduce complexity
    
    Args:
        geom: Shapely geometry
        tolerance: Simplification tolerance
        
    Returns:
        Simplified geometry
    """
    return geom.simplify(tolerance, preserve_topology=True)