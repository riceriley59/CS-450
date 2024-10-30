uniform float   uKa, uKd, uKs;		// coefficients of each type of lighting
uniform float   uShininess;		// specular exponent

varying  vec2  vST;			// texture coords
varying  vec3  vN;			// normal vector
varying  vec3  vL;			// vector from point to light
varying  vec3  vE;			// vector from point to eye

const float R 			= 0.5;
const vec3 SALMON		= vec3( 0.98, 0.50, 0.45 );
const vec3 EYE			= vec3( 0., 1., 0. );
const vec3 SPECULARCOLOR 	= vec3( 1., 1., 1. );

void
main( )
{
	vec3 Normal    = normalize(vN);
	vec3 Light     = normalize(vL);
	vec3 Eye       = normalize(vE);

	vec3 myColor = SALMON;
	float ds = vST.s - 0.91;
	float dt = vST.t - 0.65;
  float r = 0.1;
	if( ds <= r && dt <= r ) {
		myColor = EYE;
	}

	vec3 ambient = uKa * myColor;

	float d = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
	vec3 diffuse = uKd * d * myColor;

	float s = 0.;
	if( dot(Normal,Light) > 0. )	          // only do specular if the light can see the point
	{
		vec3 ref = normalize(  reflect( -Light, Normal )  );
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 specular = uKs * s * SPECULARCOLOR.rgb;
	gl_FragColor = vec4( ambient + diffuse + specular,  1. );
}

