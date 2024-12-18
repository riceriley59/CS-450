uniform float   uKa, uKd, uKs;		// coefficients of each type of lighting
uniform float   uShininess;		// specular exponent

varying  vec2  vST;			// texture coords
varying  vec3  vN;			// normal vector
varying  vec3  vL;			// vector from point to light
varying  vec3  vE;			// vector from point to eye
varying  float elevation; 

// Define terrain colors
const vec3 GRASS_COLOR = vec3(0.2, 0.8, 0.2);
const vec3 ROCK_COLOR  = vec3(0.5, 0.5, 0.5);
const vec3 SNOW_COLOR  = vec3(1.0, 1.0, 1.0);

const vec3 SPECULARCOLOR = vec3(1.0, 1.0, 1.0);

// Elevation thresholds
const float ROCK_START = 0.7;  // height where rock starts
const float SNOW_START = 2.; // height where snow starts

void main()
{
    // Determine elevation-based color
    vec3 terrainColor;

    if (elevation >= SNOW_START)
    {
        terrainColor = SNOW_COLOR;
    }
    else if (elevation >= ROCK_START)
    {
        // Blend between rock and snow based on elevation
        float t = (elevation - ROCK_START) / (SNOW_START - ROCK_START);
        terrainColor = mix(ROCK_COLOR, SNOW_COLOR, t);
    }
    else
    {
        // Blend between grass and rock based on elevation
        float t = elevation / ROCK_START;
        terrainColor = mix(GRASS_COLOR, ROCK_COLOR, t);
    }

    // Normalization of lighting vectors
    vec3 Normal = normalize(vN);
    vec3 Light = normalize(vL);
    vec3 Eye = normalize(vE);

    // Ambient lighting
    vec3 ambient = uKa * terrainColor;

    // Diffuse lighting
    float d = max(dot(Normal, Light), 0.0);
    vec3 diffuse = uKd * d * terrainColor;

    // Specular lighting
    float s = 0.0;
    if (d > 0.0)
    {
        vec3 ref = normalize(reflect(-Light, Normal));
        float cosphi = dot(Eye, ref);
        if (cosphi > 0.0)
        {
            s = pow(max(cosphi, 0.0), uShininess);
        }
    }
    vec3 specular = uKs * s * SPECULARCOLOR;

    // Final color
    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}
