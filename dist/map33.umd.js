!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("get-pixels"),require("three")):"function"==typeof define&&define.amd?define(["exports","get-pixels","three"],t):t((e=e||self).map33={},e.getPixels,e.three)}(this,function(e,t,n){function i(){return(i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e}).apply(this,arguments)}t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;var o=new n.TextureLoader,r=new n.MeshNormalMaterial({wireframe:!0}),s=function(){function e(){}return e.long2tile=function(e,t){return(e+180)/360*Math.pow(2,t)},e.lat2tile=function(e,t){return(1-Math.log(Math.tan(e*Math.PI/180)+1/Math.cos(e*Math.PI/180))/Math.PI)/2*Math.pow(2,t)},e.geo2tile=function(t,n){var i=Math.pow(2,n);return{x:Math.abs(Math.floor(e.long2tile(t[1],n))%i),y:Math.abs(Math.floor(e.lat2tile(t[0],n))%i)}},e.tile2position=function(e,t,n,i,o){var r=function(e){return{x:i.x/Math.pow(2,10-e),y:i.y/Math.pow(2,10-e)}}(e);return{x:(t-i.x-r.x%1+i.x%1)*o,y:(-n+i.y+r.y%1-i.y%1)*o,z:0}},e.position2tile=function(t,n,i,o,r){var s=e.tile2position(t,o.x,o.y,o,r);console.log(s);var a=Math.round((n-s.x)/r),l=Math.round(-(i-s.y)/r);return{x:a+o.x,y:l+o.y,z:t}},e}(),a=function(){function e(e,t,i){this.vec=new n.Vector3,this.position=new n.Vector3,this.camera=e,this.map=t,this.domElement=i,this.domElement.addEventListener("mousemove",this.onMouseMove.bind(this)),this.domElement.addEventListener("dblclick",this.onMouseClick.bind(this))}var t=e.prototype;return t.computeWorldPosition=function(e){this.vec.set(e.clientX/window.innerWidth*2-1,-e.clientY/window.innerHeight*2+1,.5),this.vec.unproject(this.camera),this.vec.sub(this.camera.position).normalize();var t=-this.camera.position.z/this.vec.z;this.position.copy(this.camera.position).add(this.vec.multiplyScalar(t))},t.onMouseMove=function(e){},t.onMouseClick=function(e){this.computeWorldPosition(e),this.map.addFromPosition(this.position.x,this.position.y)},t.go=function(e,t){this.map.clean(),this.map.geoLocation=[e,t],this.map.init()},e}(),l=function(){function e(e,t,n,i){void 0===i&&(i=600),this.size=i,this.z=e,this.x=t,this.y=n,this.baseURL="https://s3.amazonaws.com/elevation-tiles-prod/terrarium",this.shape=null,this.elevation=null,this.seamX=!1,this.seamY=!1,this.mapboxToken="pk.eyJ1IjoibWF4bXJlIiwiYSI6ImNrY2F5bHk1czBkdXUydHVuNTJoNmxkczEifQ.tzMKMH4ElqyY-xR77zRz_w"}var a=e.prototype;return a.key=function(){return this.z+"/"+this.x+"/"+this.y},a.keyNeighX=function(){return this.z+"/"+(this.x+1)+"/"+this.y},a.keyNeighY=function(){return this.z+"/"+this.x+"/"+(this.y+1)},a.url=function(){return this.baseURL+"/"+this.z+"/"+this.x+"/"+this.y+".png"},a.mapUrlOSM=function(){return"https://c.tile.openstreetmap.org/"+this.z+"/"+this.x+"/"+this.y+".png"},a._mapUrlMapbox=function(e,t,n,i){return"https://api.mapbox.com/v4/mapbox.satellite/"+e+"/"+t+"/"+n+"@2x.jpg80?access_token="+i},a.mapUrlMapbox=function(){return this._mapUrlMapbox(this.z,this.x,this.y,this.mapboxToken)},a.computeElevation=function(e){this.shape=e.shape;for(var t=new Float32Array(e.shape[0]*e.shape[1]),n=0;n<e.shape[0];n++)for(var i=0;i<e.shape[1];i++){var o=n+e.shape[0]*i,r=4*o;t[o]=256*e.data[r]+e.data[r+1]+e.data[r+2]/256-32768}this.elevation=t},a.buildGeometry=function(){for(var e,t,i=new n.PlaneBufferGeometry(this.size,this.size,this.shape[0]/2,this.shape[1]/2),o=Math.sqrt(i.attributes.position.count),r=Math.sqrt(this.elevation.length),s=r/(o-1),a=0;a<i.attributes.position.count-o;a++)a%o!=o-1&&(e=Math.floor(a/o),t=a%o,i.attributes.position.setZ(a,.045*this.elevation[Math.round(Math.round(e*s)*r+t*s)]));i.computeVertexNormals(),this.geometry=i},a.childrens=function(){return[new e(this.z+1,2*this.x,2*this.y),new e(this.z+1,2*this.x,2*this.y+1),new e(this.z+1,2*this.x+1,2*this.y),new e(this.z+1,2*this.x+1,2*this.y+1)]},a.buildMaterial=function(){return e=this.childrens().map(function(e){return e.mapUrlMapbox()}),Promise.all(e.map(function(e){return o.loadAsync(e)})).then(function(e){return new n.ShaderMaterial({uniforms:i({mapNW:{value:e[0]},mapSW:{value:e[1]},mapNE:{value:e[2]},mapSE:{value:e[3]}},n.UniformsLib.common,n.UniformsLib.lights,n.UniformsLib.fog),vertexShader:"\n#define PHONG\n\nvarying vec3 vViewPosition;\n\n#ifndef FLAT_SHADED\n\n\tvarying vec3 vNormal;\n\n#endif\n\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nvoid main() {\n\n\t#include <uv_vertex>\n\t#include <uv2_vertex>\n\t#include <color_vertex>\n\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\n#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED\n\n\tvNormal = normalize( transformedNormal );\n\n#endif\n\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\n\tvViewPosition = - mvPosition.xyz;\n\n\t#include <worldpos_vertex>\n\t#include <envmap_vertex>\n\t#include <shadowmap_vertex>\n\t#include <fog_vertex>\n\n}\n",fragmentShader:"\n#define PHONG\n\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\n\n// ####### custom uniforms #########\nuniform sampler2D mapNW;\nuniform sampler2D mapSW;\nuniform sampler2D mapNE;\nuniform sampler2D mapSE;\n// #################################\n\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <cube_uv_reflection_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\nvoid main() {\n\n\t#include <clipping_planes_fragment>\n\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\tvec3 totalEmissiveRadiance = emissive;\n\n\t#include <logdepthbuf_fragment>\n\n  #ifdef USE_MAP\n\n  vec4 colorSW = mix(mix(texture2D(mapSW, vUv * 2.), vec4(0.), step(0.5, vUv.x)), vec4(0.), step(0.5, vUv.y));\n  vec4 colorNW = mix(mix(texture2D(mapNW, vUv * 2. + vec2(0., -1.)), vec4(0.), step(0.5, vUv.x)), vec4(0.), 1. - step(0.5, vUv.y));\n  vec4 colorSE = mix(mix(texture2D(mapSE, vUv * 2. + vec2(-1., 0.)), vec4(0.), 1. - step(0.5, vUv.x)), vec4(0.), step(0.5, vUv.y));\n  vec4 colorNE = mix(mix(texture2D(mapNE, vUv * 2. + vec2(-1., -1.)), vec4(0.), 1. - step(0.5, vUv.x)), vec4(0.), 1. - step(0.5, vUv.y));\n\n  // texelColor = mapTexelToLinear(texelColor);\n  diffuseColor *= colorSW + colorNW + colorNE + colorSE;\n\n  #endif\n\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <specularmap_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\t#include <emissivemap_fragment>\n\n\t// accumulation\n\t#include <lights_phong_fragment>\n\t#include <lights_fragment_begin>\n\t#include <lights_fragment_maps>\n\t#include <lights_fragment_end>\n\n\t// modulation\n\t#include <aomap_fragment>\n\n\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n\n\t#include <envmap_fragment>\n\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n\n}\n",defines:{USE_MAP:!0,USE_UV:!0},lights:!0,fog:!0})});var e},a.buildmesh=function(){var e=this;this.buildMaterial().then(function(t){e.mesh.material=t}),this.mesh=new n.Mesh(this.geometry,r)},a.fetch=function(){var e=this;return new Promise(function(n,i){t(e.url(),function(t,i){t&&console.error(t),e.computeElevation(i),e.buildGeometry(),e.buildmesh(),n(e)})})},a.setPosition=function(e){var t,n=s.tile2position(this.z,this.x,this.y,e,this.size);(t=this.mesh.position).set.apply(t,Object.values(n))},a.resolveSeamY=function(e){var t=this.mesh.geometry.attributes.position.count,n=Math.sqrt(t);if(n===Math.sqrt(e.mesh.geometry.attributes.position.count))for(var i=t-n;i<t;i++)this.mesh.geometry.attributes.position.setZ(i,e.mesh.geometry.attributes.position.getZ(i-(t-n)));else console.error("resolveSeamY only implemented for geometries of same size")},a.resolveSeamX=function(e){var t=this.mesh.geometry.attributes.position.count,n=Math.sqrt(t);if(n===Math.sqrt(e.mesh.geometry.attributes.position.count))for(var i=n-1;i<t;i+=n)this.mesh.geometry.attributes.position.setZ(i,e.mesh.geometry.attributes.position.getZ(i-n+1));else console.error("resolveSeamX only implemented for geometries of same size")},a.resolveSeams=function(e){var t=!1,n=e[this.keyNeighY()],i=e[this.keyNeighX()];!1===this.seamY&&n&&n.mesh&&(this.resolveSeamY(n),this.seamY=!0,t=!0),!1===this.seamX&&i&&i.mesh&&(this.resolveSeamX(i),this.seamX=!0,t=!0),t&&(this.mesh.geometry.attributes.position.needsUpdate=!0,this.mesh.geometry.computeVertexNormals())},e}();e.Map=function(){function e(e,t,n,i,o,r,s){void 0===r&&(r=10),this.scene=e,this.camera=t,this.controls=n,this.geoLocation=i,this.nTiles=o,this.zoom=r,this.options=s,this.tileSize=600,this.tileCache={},this.init()}var t=e.prototype;return t.init=function(){var e=this;this.center=s.geo2tile(this.geoLocation,this.zoom),console.log({loc:this.geoLocation,center:this.center});for(var t=Math.floor(this.nTiles/2),n=0;n<this.nTiles;n++)for(var i=0;i<this.nTiles;i++){var o=new l(this.zoom,this.center.x+n-t,this.center.y+i-t);this.tileCache[o.key()]=o}var r=Object.values(this.tileCache).map(function(t){return t.fetch().then(function(t){return t.setPosition(e.center),e.scene.add(t.mesh),t})});Promise.all(r).then(function(t){t.reverse().forEach(function(t){t.resolveSeams(e.tileCache)})})},t.addFromPosition=function(e,t){var n=this,i=s.position2tile(this.zoom,e,t,this.center,this.tileSize),o=i.x,r=i.y;console.log({x:o,y:r,z:i.z});var a=new l(this.zoom,o,r);a.key()in this.tileCache||(this.tileCache[a.key()]=a,a.fetch().then(function(e){e.setPosition(n.center),n.scene.add(e.mesh)}).then(function(){Object.values(n.tileCache).forEach(function(e){return e.resolveSeams(n.tileCache)})}))},t.clean=function(){var e=this;Object.values(this.tileCache).forEach(function(t){e.scene.remove(t.mesh),t.mesh.geometry.dispose(),["mapSW","mapNW","mapSE","mapNE"].forEach(function(e){return t.mesh.material.uniforms[e].value.dispose()}),t.mesh.material.dispose()}),this.tileCache={}},e}(),e.MapPicker=a});
//# sourceMappingURL=map33.umd.js.map
