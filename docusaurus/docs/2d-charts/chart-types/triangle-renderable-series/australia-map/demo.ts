import {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    TriangleRenderableSeries,
    XyDataSeries,
    ETriangleSeriesDrawMode,
    ZoomPanModifier,
    ZoomExtentsModifier,
    NumberRange
} from "scichart";

// @ts-ignore
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n;n="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,n.poly2tri=t()}}(function(){return function t(n,e,i){function o(s,p){if(!e[s]){if(!n[s]){var a="function"==typeof require&&require;if(!p&&a)return a(s,!0);if(r)return r(s,!0);var h=new Error("Cannot find module '"+s+"'");throw h.code="MODULE_NOT_FOUND",h}var u=e[s]={exports:{}};n[s][0].call(u.exports,function(t){var e=n[s][1][t];return o(e||t)},u,u.exports,t,n,e,i)}return e[s].exports}for(var r="function"==typeof require&&require,s=0;s<i.length;s++)o(i[s]);return o}({1:[function(t,n,e){n.exports={version:"1.5.0"}},{}],2:[function(t,n,e){"use strict";var i=function(t,n){this.point=t,this.triangle=n||null,this.next=null,this.prev=null,this.value=t.x},o=function(t,n){this.head_=t,this.tail_=n,this.search_node_=t};o.prototype.head=function(){return this.head_},o.prototype.setHead=function(t){this.head_=t},o.prototype.tail=function(){return this.tail_},o.prototype.setTail=function(t){this.tail_=t},o.prototype.search=function(){return this.search_node_},o.prototype.setSearch=function(t){this.search_node_=t},o.prototype.findSearchNode=function(){return this.search_node_},o.prototype.locateNode=function(t){var n=this.search_node_;if(t<n.value){for(;n=n.prev;)if(t>=n.value)return this.search_node_=n,n}else for(;n=n.next;)if(t<n.value)return this.search_node_=n.prev,n.prev;return null},o.prototype.locatePoint=function(t){var n=t.x,e=this.findSearchNode(n),i=e.point.x;if(n===i){if(t!==e.point)if(t===e.prev.point)e=e.prev;else{if(t!==e.next.point)throw new Error("poly2tri Invalid AdvancingFront.locatePoint() call");e=e.next}}else if(n<i)for(;(e=e.prev)&&t!==e.point;);else for(;(e=e.next)&&t!==e.point;);return e&&(this.search_node_=e),e},n.exports=o,n.exports.Node=i},{}],3:[function(t,n,e){"use strict";function i(t,n){if(!t)throw new Error(n||"Assert Failed")}n.exports=i},{}],4:[function(t,n,e){"use strict";var i=t("./xy"),o=function(t,n){this.x=+t||0,this.y=+n||0,this._p2t_edge_list=null};o.prototype.toString=function(){return i.toStringBase(this)},o.prototype.toJSON=function(){return{x:this.x,y:this.y}},o.prototype.clone=function(){return new o(this.x,this.y)},o.prototype.set_zero=function(){return this.x=0,this.y=0,this},o.prototype.set=function(t,n){return this.x=+t||0,this.y=+n||0,this},o.prototype.negate=function(){return this.x=-this.x,this.y=-this.y,this},o.prototype.add=function(t){return this.x+=t.x,this.y+=t.y,this},o.prototype.sub=function(t){return this.x-=t.x,this.y-=t.y,this},o.prototype.mul=function(t){return this.x*=t,this.y*=t,this},o.prototype.length=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},o.prototype.normalize=function(){var t=this.length();return this.x/=t,this.y/=t,t},o.prototype.equals=function(t){return this.x===t.x&&this.y===t.y},o.negate=function(t){return new o(-t.x,-t.y)},o.add=function(t,n){return new o(t.x+n.x,t.y+n.y)},o.sub=function(t,n){return new o(t.x-n.x,t.y-n.y)},o.mul=function(t,n){return new o(t*n.x,t*n.y)},o.cross=function(t,n){return"number"==typeof t?"number"==typeof n?t*n:new o(-t*n.y,t*n.x):"number"==typeof n?new o(n*t.y,-n*t.x):t.x*n.y-t.y*n.x},o.toString=i.toString,o.compare=i.compare,o.cmp=i.compare,o.equals=i.equals,o.dot=function(t,n){return t.x*n.x+t.y*n.y},n.exports=o},{"./xy":11}],5:[function(t,n,e){"use strict";var i=t("./xy"),o=function(t,n){this.name="PointError",this.points=n=n||[],this.message=t||"Invalid Points!";for(var e=0;e<n.length;e++)this.message+=" "+i.toString(n[e])};o.prototype=new Error,o.prototype.constructor=o,n.exports=o},{"./xy":11}],6:[function(t,n,e){(function(n){"use strict";var i=n.poly2tri;e.noConflict=function(){return n.poly2tri=i,e},e.VERSION=t("../dist/version.json").version,e.PointError=t("./pointerror"),e.Point=t("./point"),e.Triangle=t("./triangle"),e.SweepContext=t("./sweepcontext");var o=t("./sweep");e.triangulate=o.triangulate,e.sweep={Triangulate:o.triangulate}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../dist/version.json":1,"./point":4,"./pointerror":5,"./sweep":7,"./sweepcontext":8,"./triangle":9}],7:[function(t,n,e){"use strict";function i(t){t.initTriangulation(),t.createAdvancingFront(),o(t),r(t)}function o(t){var n,e=t.pointCount();for(n=1;n<e;++n)for(var i=t.getPoint(n),o=s(t,i),r=i._p2t_edge_list,a=0;r&&a<r.length;++a)p(t,r[a],o)}function r(t){for(var n=t.front().head().next.triangle,e=t.front().head().next.point;!n.getConstrainedEdgeCW(e);)n=n.neighborCCW(e);t.meshClean(n)}function s(t,n){var e=t.locateNode(n),i=u(t,n,e);return n.x<=e.point.x+F&&d(t,e),g(t,i),i}function p(t,n,e){t.edge_event.constrained_edge=n,t.edge_event.right=n.p.x>n.q.x,h(e.triangle,n.p,n.q)||(C(t,n,e),a(t,n.p,n.q,e.triangle,n.q))}function a(t,n,e,i,o){if(!h(i,n,e)){var r=i.pointCCW(o),s=z(e,r,n);if(s===M.COLLINEAR)throw new D("poly2tri EdgeEvent: Collinear not supported!",[e,r,n]);var p=i.pointCW(o),u=z(e,p,n);if(u===M.COLLINEAR)throw new D("poly2tri EdgeEvent: Collinear not supported!",[e,p,n]);s===u?(i=s===M.CW?i.neighborCCW(o):i.neighborCW(o),a(t,n,e,i,o)):q(t,n,e,i,o)}}function h(t,n,e){var i=t.edgeIndex(n,e);if(-1!==i){t.markConstrainedEdgeByIndex(i);var o=t.getNeighbor(i);return o&&o.markConstrainedEdgeByPoints(n,e),!0}return!1}function u(t,n,e){var i=new O(n,e.point,e.next.point);i.markNeighbor(e.triangle),t.addToMap(i);var o=new L(n);return o.next=e.next,o.prev=e,e.next.prev=o,e.next=o,l(t,i)||t.mapTriangleToNodes(i),o}function d(t,n){var e=new O(n.prev.point,n.point,n.next.point);e.markNeighbor(n.prev.triangle),e.markNeighbor(n.triangle),t.addToMap(e),n.prev.next=n.next,n.next.prev=n.prev,l(t,e)||t.mapTriangleToNodes(e)}function g(t,n){for(var e=n.next;e.next&&!j(e.point,e.next.point,e.prev.point);)d(t,e),e=e.next;for(e=n.prev;e.prev&&!j(e.point,e.next.point,e.prev.point);)d(t,e),e=e.prev;n.next&&n.next.next&&f(n)&&y(t,n)}function f(t){var n=t.point.x-t.next.next.point.x,e=t.point.y-t.next.next.point.y;return S(e>=0,"unordered y"),n>=0||Math.abs(n)<e}function l(t,n){for(var e=0;e<3;++e)if(!n.delaunay_edge[e]){var i=n.getNeighbor(e);if(i){var o=n.getPoint(e),r=i.oppositePoint(n,o),s=i.index(r);if(i.constrained_edge[s]||i.delaunay_edge[s]){n.constrained_edge[e]=i.constrained_edge[s];continue}var p=c(o,n.pointCCW(o),n.pointCW(o),r);if(p){n.delaunay_edge[e]=!0,i.delaunay_edge[s]=!0,_(n,o,i,r);var a=!l(t,n);return a&&t.mapTriangleToNodes(n),a=!l(t,i),a&&t.mapTriangleToNodes(i),n.delaunay_edge[e]=!1,i.delaunay_edge[s]=!1,!0}}}return!1}function c(t,n,e,i){var o=t.x-i.x,r=t.y-i.y,s=n.x-i.x,p=n.y-i.y,a=o*p,h=s*r,u=a-h;if(u<=0)return!1;var d=e.x-i.x,g=e.y-i.y,f=d*r,l=o*g,c=f-l;return!(c<=0)&&(o*o+r*r)*(s*g-d*p)+(s*s+p*p)*c+(d*d+g*g)*u>0}function _(t,n,e,i){var o,r,s,p;o=t.neighborCCW(n),r=t.neighborCW(n),s=e.neighborCCW(i),p=e.neighborCW(i);var a,h,u,d;a=t.getConstrainedEdgeCCW(n),h=t.getConstrainedEdgeCW(n),u=e.getConstrainedEdgeCCW(i),d=e.getConstrainedEdgeCW(i);var g,f,l,c;g=t.getDelaunayEdgeCCW(n),f=t.getDelaunayEdgeCW(n),l=e.getDelaunayEdgeCCW(i),c=e.getDelaunayEdgeCW(i),t.legalize(n,i),e.legalize(i,n),e.setDelaunayEdgeCCW(n,g),t.setDelaunayEdgeCW(n,f),t.setDelaunayEdgeCCW(i,l),e.setDelaunayEdgeCW(i,c),e.setConstrainedEdgeCCW(n,a),t.setConstrainedEdgeCW(n,h),t.setConstrainedEdgeCCW(i,u),e.setConstrainedEdgeCW(i,d),t.clearNeighbors(),e.clearNeighbors(),o&&e.markNeighbor(o),r&&t.markNeighbor(r),s&&t.markNeighbor(s),p&&e.markNeighbor(p),t.markNeighbor(e)}function y(t,n){for(z(n.point,n.next.point,n.next.next.point)===M.CCW?t.basin.left_node=n.next.next:t.basin.left_node=n.next,t.basin.bottom_node=t.basin.left_node;t.basin.bottom_node.next&&t.basin.bottom_node.point.y>=t.basin.bottom_node.next.point.y;)t.basin.bottom_node=t.basin.bottom_node.next;if(t.basin.bottom_node!==t.basin.left_node){for(t.basin.right_node=t.basin.bottom_node;t.basin.right_node.next&&t.basin.right_node.point.y<t.basin.right_node.next.point.y;)t.basin.right_node=t.basin.right_node.next;t.basin.right_node!==t.basin.bottom_node&&(t.basin.width=t.basin.right_node.point.x-t.basin.left_node.point.x,t.basin.left_highest=t.basin.left_node.point.y>t.basin.right_node.point.y,x(t,t.basin.bottom_node))}}function x(t,n){if(!v(t,n)){d(t,n);if(n.prev!==t.basin.left_node||n.next!==t.basin.right_node){if(n.prev===t.basin.left_node){if(z(n.point,n.next.point,n.next.next.point)===M.CW)return;n=n.next}else if(n.next===t.basin.right_node){if(z(n.point,n.prev.point,n.prev.prev.point)===M.CCW)return;n=n.prev}else n=n.prev.point.y<n.next.point.y?n.prev:n.next;x(t,n)}}}function v(t,n){var e;return e=t.basin.left_highest?t.basin.left_node.point.y-n.point.y:t.basin.right_node.point.y-n.point.y,t.basin.width>e}function C(t,n,e){t.edge_event.right?b(t,n,e):w(t,n,e)}function b(t,n,e){for(;e.next.point.x<n.p.x;)z(n.q,e.next.point,n.p)===M.CCW?m(t,n,e):e=e.next}function m(t,n,e){e.point.x<n.p.x&&(z(e.point,e.next.point,e.next.next.point)===M.CCW?W(t,n,e):(E(t,n,e),m(t,n,e)))}function W(t,n,e){d(t,e.next),e.next.point!==n.p&&z(n.q,e.next.point,n.p)===M.CCW&&z(e.point,e.next.point,e.next.next.point)===M.CCW&&W(t,n,e)}function E(t,n,e){z(e.next.point,e.next.next.point,e.next.next.next.point)===M.CCW?W(t,n,e.next):z(n.q,e.next.next.point,n.p)===M.CCW&&E(t,n,e.next)}function w(t,n,e){for(;e.prev.point.x>n.p.x;)z(n.q,e.prev.point,n.p)===M.CW?P(t,n,e):e=e.prev}function P(t,n,e){e.point.x>n.p.x&&(z(e.point,e.prev.point,e.prev.prev.point)===M.CW?T(t,n,e):(N(t,n,e),P(t,n,e)))}function N(t,n,e){z(e.prev.point,e.prev.prev.point,e.prev.prev.prev.point)===M.CW?T(t,n,e.prev):z(n.q,e.prev.prev.point,n.p)===M.CW&&N(t,n,e.prev)}function T(t,n,e){d(t,e.prev),e.prev.point!==n.p&&z(n.q,e.prev.point,n.p)===M.CW&&z(e.point,e.prev.point,e.prev.prev.point)===M.CW&&T(t,n,e)}function q(t,n,e,i,o){var r=i.neighborAcross(o);S(r,"FLIP failed due to missing triangle!");var s=r.oppositePoint(i,o);if(i.getConstrainedEdgeAcross(o)){var p=i.index(o);throw new D("poly2tri Intersecting Constraints",[o,s,i.getPoint((p+1)%3),i.getPoint((p+2)%3)])}if(H(o,i.pointCCW(o),i.pointCW(o),s))if(_(i,o,r,s),t.mapTriangleToNodes(i),t.mapTriangleToNodes(r),o===e&&s===n)e===t.edge_event.constrained_edge.q&&n===t.edge_event.constrained_edge.p&&(i.markConstrainedEdgeByPoints(n,e),r.markConstrainedEdgeByPoints(n,e),l(t,i),l(t,r));else{var h=z(e,s,n);i=I(t,h,i,r,o,s),q(t,n,e,i,o)}else{A(t,n,e,i,r,k(n,e,r,s)),a(t,n,e,i,o)}}function I(t,n,e,i,o,r){var s;return n===M.CCW?(s=i.edgeIndex(o,r),i.delaunay_edge[s]=!0,l(t,i),i.clearDelaunayEdges(),e):(s=e.edgeIndex(o,r),e.delaunay_edge[s]=!0,l(t,e),e.clearDelaunayEdges(),i)}function k(t,n,e,i){var o=z(n,i,t);if(o===M.CW)return e.pointCCW(i);if(o===M.CCW)return e.pointCW(i);throw new D("poly2tri [Unsupported] nextFlipPoint: opposing point on constrained edge!",[n,i,t])}function A(t,n,e,i,o,r){var s=o.neighborAcross(r);S(s,"FLIP failed due to missing triangle");var p=s.oppositePoint(o,r);if(H(e,i.pointCCW(e),i.pointCW(e),p))q(t,e,p,s,p);else{A(t,n,e,i,s,k(n,e,s,p))}}var S=t("./assert"),D=t("./pointerror"),O=t("./triangle"),L=t("./advancingfront").Node,B=t("./utils"),F=B.EPSILON,M=B.Orientation,z=B.orient2d,H=B.inScanArea,j=B.isAngleObtuse;e.triangulate=i},{"./advancingfront":2,"./assert":3,"./pointerror":5,"./triangle":9,"./utils":10}],8:[function(t,n,e){"use strict";var i=t("./pointerror"),o=t("./point"),r=t("./triangle"),s=t("./sweep"),p=t("./advancingfront"),a=p.Node,h=function(t,n){if(this.p=t,this.q=n,t.y>n.y)this.q=t,this.p=n;else if(t.y===n.y)if(t.x>n.x)this.q=t,this.p=n;else if(t.x===n.x)throw new i("poly2tri Invalid Edge constructor: repeated points!",[t]);this.q._p2t_edge_list||(this.q._p2t_edge_list=[]),this.q._p2t_edge_list.push(this)},u=function(){this.left_node=null,this.bottom_node=null,this.right_node=null,this.width=0,this.left_highest=!1};u.prototype.clear=function(){this.left_node=null,this.bottom_node=null,this.right_node=null,this.width=0,this.left_highest=!1};var d=function(){this.constrained_edge=null,this.right=!1},g=function(t,n){n=n||{},this.triangles_=[],this.map_=[],this.points_=n.cloneArrays?t.slice(0):t,this.edge_list=[],this.pmin_=this.pmax_=null,this.front_=null,this.head_=null,this.tail_=null,this.af_head_=null,this.af_middle_=null,this.af_tail_=null,this.basin=new u,this.edge_event=new d,this.initEdges(this.points_)};g.prototype.addHole=function(t){this.initEdges(t);var n,e=t.length;for(n=0;n<e;n++)this.points_.push(t[n]);return this},g.prototype.AddHole=g.prototype.addHole,g.prototype.addHoles=function(t){var n,e=t.length;for(n=0;n<e;n++)this.initEdges(t[n]);return this.points_=this.points_.concat.apply(this.points_,t),this},g.prototype.addPoint=function(t){return this.points_.push(t),this},g.prototype.AddPoint=g.prototype.addPoint,g.prototype.addPoints=function(t){return this.points_=this.points_.concat(t),this},g.prototype.triangulate=function(){return s.triangulate(this),this},g.prototype.getBoundingBox=function(){return{min:this.pmin_,max:this.pmax_}},g.prototype.getTriangles=function(){return this.triangles_},g.prototype.GetTriangles=g.prototype.getTriangles,g.prototype.front=function(){return this.front_},g.prototype.pointCount=function(){return this.points_.length},g.prototype.head=function(){return this.head_},g.prototype.setHead=function(t){this.head_=t},g.prototype.tail=function(){return this.tail_},g.prototype.setTail=function(t){this.tail_=t},g.prototype.getMap=function(){return this.map_},g.prototype.initTriangulation=function(){var t,n=this.points_[0].x,e=this.points_[0].x,i=this.points_[0].y,r=this.points_[0].y,s=this.points_.length;for(t=1;t<s;t++){var p=this.points_[t];p.x>n&&(n=p.x),p.x<e&&(e=p.x),p.y>i&&(i=p.y),p.y<r&&(r=p.y)}this.pmin_=new o(e,r),this.pmax_=new o(n,i);var a=.3*(n-e),h=.3*(i-r);this.head_=new o(n+a,r-h),this.tail_=new o(e-a,r-h),this.points_.sort(o.compare)},g.prototype.initEdges=function(t){var n,e=t.length;for(n=0;n<e;++n)this.edge_list.push(new h(t[n],t[(n+1)%e]))},g.prototype.getPoint=function(t){return this.points_[t]},g.prototype.addToMap=function(t){this.map_.push(t)},g.prototype.locateNode=function(t){return this.front_.locateNode(t.x)},g.prototype.createAdvancingFront=function(){var t,n,e,i=new r(this.points_[0],this.tail_,this.head_);this.map_.push(i),t=new a(i.getPoint(1),i),n=new a(i.getPoint(0),i),e=new a(i.getPoint(2)),this.front_=new p(t,e),t.next=n,n.next=e,n.prev=t,e.prev=n},g.prototype.removeNode=function(t){},g.prototype.mapTriangleToNodes=function(t){for(var n=0;n<3;++n)if(!t.getNeighbor(n)){var e=this.front_.locatePoint(t.pointCW(t.getPoint(n)));e&&(e.triangle=t)}},g.prototype.removeFromMap=function(t){var n,e=this.map_,i=e.length;for(n=0;n<i;n++)if(e[n]===t){e.splice(n,1);break}},g.prototype.meshClean=function(t){for(var n,e,i=[t];n=i.pop();)if(!n.isInterior())for(n.setInterior(!0),this.triangles_.push(n),e=0;e<3;e++)n.constrained_edge[e]||i.push(n.getNeighbor(e))},n.exports=g},{"./advancingfront":2,"./point":4,"./pointerror":5,"./sweep":7,"./triangle":9}],9:[function(t,n,e){"use strict";var i=t("./xy"),o=function(t,n,e){this.points_=[t,n,e],this.neighbors_=[null,null,null],this.interior_=!1,this.constrained_edge=[!1,!1,!1],this.delaunay_edge=[!1,!1,!1]},r=i.toString;o.prototype.toString=function(){return"["+r(this.points_[0])+r(this.points_[1])+r(this.points_[2])+"]"},o.prototype.getPoint=function(t){return this.points_[t]},o.prototype.GetPoint=o.prototype.getPoint,o.prototype.getPoints=function(){return this.points_},o.prototype.getNeighbor=function(t){return this.neighbors_[t]},o.prototype.containsPoint=function(t){var n=this.points_;return t===n[0]||t===n[1]||t===n[2]},o.prototype.containsEdge=function(t){return this.containsPoint(t.p)&&this.containsPoint(t.q)},o.prototype.containsPoints=function(t,n){return this.containsPoint(t)&&this.containsPoint(n)},o.prototype.isInterior=function(){return this.interior_},o.prototype.setInterior=function(t){return this.interior_=t,this},o.prototype.markNeighborPointers=function(t,n,e){var i=this.points_;if(t===i[2]&&n===i[1]||t===i[1]&&n===i[2])this.neighbors_[0]=e;else if(t===i[0]&&n===i[2]||t===i[2]&&n===i[0])this.neighbors_[1]=e;else{if(!(t===i[0]&&n===i[1]||t===i[1]&&n===i[0]))throw new Error("poly2tri Invalid Triangle.markNeighborPointers() call");this.neighbors_[2]=e}},o.prototype.markNeighbor=function(t){var n=this.points_;t.containsPoints(n[1],n[2])?(this.neighbors_[0]=t,t.markNeighborPointers(n[1],n[2],this)):t.containsPoints(n[0],n[2])?(this.neighbors_[1]=t,t.markNeighborPointers(n[0],n[2],this)):t.containsPoints(n[0],n[1])&&(this.neighbors_[2]=t,t.markNeighborPointers(n[0],n[1],this))},o.prototype.clearNeighbors=function(){this.neighbors_[0]=null,this.neighbors_[1]=null,this.neighbors_[2]=null},o.prototype.clearDelaunayEdges=function(){this.delaunay_edge[0]=!1,this.delaunay_edge[1]=!1,this.delaunay_edge[2]=!1},o.prototype.pointCW=function(t){var n=this.points_;return t===n[0]?n[2]:t===n[1]?n[0]:t===n[2]?n[1]:null},o.prototype.pointCCW=function(t){var n=this.points_;return t===n[0]?n[1]:t===n[1]?n[2]:t===n[2]?n[0]:null},o.prototype.neighborCW=function(t){return t===this.points_[0]?this.neighbors_[1]:t===this.points_[1]?this.neighbors_[2]:this.neighbors_[0]},o.prototype.neighborCCW=function(t){return t===this.points_[0]?this.neighbors_[2]:t===this.points_[1]?this.neighbors_[0]:this.neighbors_[1]},o.prototype.getConstrainedEdgeCW=function(t){return t===this.points_[0]?this.constrained_edge[1]:t===this.points_[1]?this.constrained_edge[2]:this.constrained_edge[0]},o.prototype.getConstrainedEdgeCCW=function(t){return t===this.points_[0]?this.constrained_edge[2]:t===this.points_[1]?this.constrained_edge[0]:this.constrained_edge[1]},o.prototype.getConstrainedEdgeAcross=function(t){return t===this.points_[0]?this.constrained_edge[0]:t===this.points_[1]?this.constrained_edge[1]:this.constrained_edge[2]},o.prototype.setConstrainedEdgeCW=function(t,n){t===this.points_[0]?this.constrained_edge[1]=n:t===this.points_[1]?this.constrained_edge[2]=n:this.constrained_edge[0]=n},o.prototype.setConstrainedEdgeCCW=function(t,n){t===this.points_[0]?this.constrained_edge[2]=n:t===this.points_[1]?this.constrained_edge[0]=n:this.constrained_edge[1]=n},o.prototype.getDelaunayEdgeCW=function(t){return t===this.points_[0]?this.delaunay_edge[1]:t===this.points_[1]?this.delaunay_edge[2]:this.delaunay_edge[0]},o.prototype.getDelaunayEdgeCCW=function(t){return t===this.points_[0]?this.delaunay_edge[2]:t===this.points_[1]?this.delaunay_edge[0]:this.delaunay_edge[1]},o.prototype.setDelaunayEdgeCW=function(t,n){t===this.points_[0]?this.delaunay_edge[1]=n:t===this.points_[1]?this.delaunay_edge[2]=n:this.delaunay_edge[0]=n},o.prototype.setDelaunayEdgeCCW=function(t,n){t===this.points_[0]?this.delaunay_edge[2]=n:t===this.points_[1]?this.delaunay_edge[0]=n:this.delaunay_edge[1]=n},o.prototype.neighborAcross=function(t){return t===this.points_[0]?this.neighbors_[0]:t===this.points_[1]?this.neighbors_[1]:this.neighbors_[2]},o.prototype.oppositePoint=function(t,n){var e=t.pointCW(n);return this.pointCW(e)},o.prototype.legalize=function(t,n){var e=this.points_;if(t===e[0])e[1]=e[0],e[0]=e[2],e[2]=n;else if(t===e[1])e[2]=e[1],e[1]=e[0],e[0]=n;else{if(t!==e[2])throw new Error("poly2tri Invalid Triangle.legalize() call");e[0]=e[2],e[2]=e[1],e[1]=n}},o.prototype.index=function(t){var n=this.points_;if(t===n[0])return 0;if(t===n[1])return 1;if(t===n[2])return 2;throw new Error("poly2tri Invalid Triangle.index() call")},o.prototype.edgeIndex=function(t,n){var e=this.points_;if(t===e[0]){if(n===e[1])return 2;if(n===e[2])return 1}else if(t===e[1]){if(n===e[2])return 0;if(n===e[0])return 2}else if(t===e[2]){if(n===e[0])return 1;if(n===e[1])return 0}return-1},o.prototype.markConstrainedEdgeByIndex=function(t){this.constrained_edge[t]=!0},o.prototype.markConstrainedEdgeByEdge=function(t){this.markConstrainedEdgeByPoints(t.p,t.q)},o.prototype.markConstrainedEdgeByPoints=function(t,n){var e=this.points_;n===e[0]&&t===e[1]||n===e[1]&&t===e[0]?this.constrained_edge[2]=!0:n===e[0]&&t===e[2]||n===e[2]&&t===e[0]?this.constrained_edge[1]=!0:(n===e[1]&&t===e[2]||n===e[2]&&t===e[1])&&(this.constrained_edge[0]=!0)},n.exports=o},{"./xy":11}],10:[function(t,n,e){"use strict";function i(t,n,e){var i=(t.x-e.x)*(n.y-e.y),o=(t.y-e.y)*(n.x-e.x),r=i-o;return r>-s&&r<s?p.COLLINEAR:r>0?p.CCW:p.CW}function o(t,n,e,i){return!((t.x-n.x)*(i.y-n.y)-(i.x-n.x)*(t.y-n.y)>=-s)&&!((t.x-e.x)*(i.y-e.y)-(i.x-e.x)*(t.y-e.y)<=s)}function r(t,n,e){var i=n.x-t.x,o=n.y-t.y;return i*(e.x-t.x)+o*(e.y-t.y)<0}var s=1e-12;e.EPSILON=s;var p={CW:1,CCW:-1,COLLINEAR:0};e.Orientation=p,e.orient2d=i,e.inScanArea=o,e.isAngleObtuse=r},{}],11:[function(t,n,e){"use strict";function i(t){return"("+t.x+";"+t.y+")"}function o(t){var n=t.toString();return"[object Object]"===n?i(t):n}function r(t,n){return t.y===n.y?t.x-n.x:t.y-n.y}function s(t,n){return t.x===n.x&&t.y===n.y}n.exports={toString:o,toStringBase:i,compare:r,equals:s}},{}]},{},[6])(6)});

const tasmania = [
    // [146, -42],
    // [147.68925947488418, -40.808258152022674],
    [146.3641207216237, -41.13769540788336],
    [145.3979781434948, -40.79254851660594],
    [144.7437545106797, -40.70397511165767],
    [144.71807132383066, -41.16255177181576],
    [145.29509036680173, -42.033609714527564],
    [145.4319295595106, -42.693776137056254],
    [146.04837772032033, -43.549744561538844],
    [146.87034305235488, -43.6345972633621],
    [147.56456424376393, -42.937688897473905],
    [147.91405195535384, -43.211522312188535],
    [148.01730146707303, -42.40702361426865],
    [148.35986453673587, -42.06244516374644],
    [148.289067824496, -40.87543751400211],
    [147.68925947488418, -40.808258152022674]
];

const australia = [
    // [135, -25],
    // [126.14871382050114, -32.21596607842059],
    [127.1028674663383, -32.28226694105106],
    [129.53579389863972, -31.590422865527465],
    [131.32633060112084, -31.49580331800104],
    [132.28808068250487, -31.982646986622782],
    [132.99077680880976, -32.01122405368019],
    [134.27390262261702, -32.61723357516699],
    [134.08590376193916, -32.84807219821479],
    [134.6134167827746, -33.222778008763164],
    [135.23921837782916, -33.94795338311502],
    [135.20821251845405, -34.478670342752565],
    [135.98904341038428, -34.89011809666046],
    [136.37206912653164, -34.094766127256236],
    [136.9968371929404, -33.752771498348615],
    [137.81032759007905, -32.90000701266812],
    [137.8901160015377, -33.64047861097838],
    [137.50388634658827, -34.13026783624075],
    [137.35237104710848, -34.7073385556441],
    [136.8294055523147, -35.26053476332861],
    [137.71917036351618, -35.076825046531],
    [138.20756432510672, -34.38472258884593],
    [138.44946170466494, -35.127261244447865],
    [138.12074791885635, -35.61229623793939],
    [139.08280805883413, -35.732754001611745],
    [139.57414757706528, -36.13836231867066],
    [139.8065881695141, -36.64360279718831],
    [139.99215823787426, -37.402936293285094],
    [140.63857872941327, -38.019332777662555],
    [141.60658165910468, -38.30851409276788],
    [142.17832970598192, -38.380034275059835],
    [143.60997358619602, -38.8094654274053],
    [144.48568240781407, -38.085323581699285],
    [145.03221235573295, -37.89618783951102],
    [144.87697635312816, -38.41744801203915],
    [145.4896521343806, -38.59376799901902],
    [146.31792199115478, -39.03575652441141],
    [147.38173302631526, -38.21921721776752],
    [148.30462243061584, -37.809061374666925],
    [149.42388227762552, -37.77268116633344],
    [149.99728397033613, -37.42526051203518],
    [150.0752120302323, -36.42020558039054],
    [150.3282198427333, -35.671879164371916],
    [150.71413943908902, -35.173459974916796],
    [151.0105554547152, -34.31036020277793],
    [151.70911746643674, -33.041342054986394],
    [152.45000247620533, -32.550002536755265],
    [152.89157759013938, -31.640445651986],
    [153.08960167868184, -30.923641859665423],
    [153.06924116435886, -30.350240166954794],
    [153.51210818910022, -28.99507740653271],
    [153.56946902894418, -28.11006682710208],
    [153.0929089703485, -27.260299574494514],
    [153.1361621441768, -26.071173191026215],
    [152.8551973818059, -25.267501316023],
    [152.07353966695905, -24.457886651306225],
    [150.89955447815225, -23.462236830338696],
    [150.72726525289113, -22.402404880464665],
    [150.48293908101516, -22.556142266532994],
    [150.07738244038853, -22.122783705333337],
    [149.6783370302307, -22.342511895438385],
    [149.28942020080206, -21.260510756111135],
    [148.71746544819558, -20.63346892668155],
    [148.84841352762322, -20.391209812097244],
    [147.4710815777479, -19.48072275154673],
    [146.38747846901964, -18.958274021075887],
    [146.06367394427872, -18.28007252367734],
    [146.16030887266453, -17.761654554925272],
    [145.88890425026761, -16.906926364817686],
    [145.637033319277, -16.78491830817657],
    [145.27199100156724, -15.428205254785732],
    [145.3747237489635, -14.98497649501833],
    [144.89490807513346, -14.594457696188641],
    [144.56371382057483, -14.171176039285903],
    [143.9220992372389, -14.548310642151996],
    [143.5618111513, -13.763655694232192],
    [143.5221236512998, -12.834358412327433],
    [143.15863162655876, -12.325655612846232],
    [143.11594689348573, -11.905629571177885],
    [142.86676313697427, -11.784706719614903],
    [142.797310011974, -11.157354831591562],
    [142.51526004452495, -10.668185723516686],
    [142.1437064963464, -11.042736504768186],
    [142.11848839738798, -11.328042087451612],
    [141.68699018775084, -12.407614434461145],
    [141.8426912782462, -12.741547539931231],
    [141.65092003801107, -12.944687595270585],
    [141.5198686057189, -13.698078301653808],
    [141.6355204611881, -14.270394789286307],
    [141.56338016170866, -14.561333103089552],
    [141.70218305884464, -15.044921156476901],
    [141.39822228410384, -15.840531508042588],
    [141.27409549373874, -16.38887013109165],
    [140.87546349503924, -17.369068698803908],
    [140.21524539607827, -17.710804945550066],
    [139.2605749859182, -17.371600843986208],
    [139.10854292211548, -17.06267913174539],
    [138.58516401586343, -16.806622409739155],
    [138.30321740127897, -16.807604261952704],
    [137.06536014215942, -15.87076222093333],
    [136.2951745952813, -15.55026498785913],
    [135.50018436090318, -14.997740573794424],
    [135.4286641786112, -14.715432224183912],
    [136.07761681533253, -13.724278252825783],
    [135.96175825413417, -13.324509372615852],
    [136.3054065288751, -13.291229750219884],
    [136.6851249533558, -12.887223402562022],
    [136.951620314685, -12.351958916882793],
    [136.49247521377168, -11.857208754120398],
    [136.2583809754895, -12.049341729381588],
    [135.8826933127276, -11.962266940969776],
    [135.29849124566795, -12.248606052299046],
    [134.67863244032696, -11.941182956594693],
    [134.39306847548204, -12.042365411022182],
    [133.55084598198908, -11.786515394745116],
    [133.01956058159635, -11.376411228076812],
    [132.3572237489114, -11.128519382372696],
    [131.82469811414364, -11.27378183354515],
    [132.55721154188097, -11.603012383676678],
    [132.5752982931831, -12.114040622611007],
    [131.73509118054955, -12.302452894747184],
    [131.22349450086, -12.183648776908166],
    [130.61779503796697, -12.536392103732489],
    [130.18350630098604, -13.107520033422276],
    [130.33946577364293, -13.357375583553484],
    [129.8886405783286, -13.618703301653492],
    [129.40960005098293, -14.42066985439107],
    [129.62147342337965, -14.969783623924522],
    [128.35968997610894, -14.869169610252243],
    [127.80463341686196, -14.27690601975508],
    [127.06586714081732, -13.817967624570954],
    [125.68579634003055, -14.23065561285385],
    [125.67008670461381, -14.510070082256014],
    [125.16727501841387, -14.680395603090028],
    [124.92615278534004, -15.07510019293536],
    [124.37972619028575, -15.56705982835399],
    [124.25828657439985, -16.327943617419535],
    [123.81707319549184, -16.111316013252],
    [123.50324222218329, -16.596506036040402],
    [123.85934451710659, -17.069035332917288],
    [123.43378909718304, -17.268558037996215],
    [123.01257449757193, -16.405199883695886],
    [122.3127722514754, -17.25496713630345],
    [122.24166548064179, -18.197648614171804],
    [121.65513797412902, -18.70531788500717],
    [121.39985639860717, -19.239755547769725],
    [120.85622033089668, -19.683707777589206],
    [119.80522505094451, -19.976506442954964],
    [119.25249393115067, -19.952941989829867],
    [118.83608523974274, -20.263310642174858],
    [118.229558953933, -20.37420826587322],
    [117.44154503791424, -20.74689869556221],
    [117.16631635952771, -20.623598728113805],
    [116.71161543179153, -20.701681817306824],
    [115.94737267462702, -21.068687839443704],
    [115.46016727097924, -21.495173435148537],
    [114.6477620789187, -21.829519952076954],
    [114.22530724493262, -22.517488295178673],
    [114.1497563009219, -21.75588103606104],
    [113.73655154831609, -22.47547535572538],
    [113.84341841029567, -23.059987481378755],
    [113.5020438985756, -23.806350192970285],
    [113.39352339076264, -24.384764499613226],
    [114.21616051641698, -25.786281019801123],
    [113.93690107631167, -25.91123463308287],
    [113.44096235560656, -25.621278171493167],
    [113.77835778204022, -26.549025160429174],
    [113.47749759323692, -26.543134047147902],
    [114.04888390508816, -27.334765313427106],
    [114.17357913620847, -28.11807667410732],
    [114.6164978373821, -28.51639861421308],
    [114.64197431850201, -28.81023080822467],
    [115.04003787644629, -29.46109547294082],
    [114.99704308477948, -30.03072478609414],
    [115.160909051577, -30.601594333622465],
    [115.68961063035516, -31.612437025683807],
    [115.80164513556394, -32.205062351207005],
    [115.54512332566708, -33.48725798923297],
    [115.04861616420676, -33.623425388322055],
    [115.02680870977957, -34.19651702243893],
    [115.56434695847966, -34.38642791111157],
    [116.62510908413495, -35.02509693780683],
    [118.02497195848949, -35.0647327613747],
    [119.00734093635802, -34.46414926527854],
    [119.29889936734875, -34.50936614353394],
    [119.89369510302822, -33.9760653622818],
    [121.29919070850259, -33.821036065406176],
    [122.1830644064228, -34.0034021949642],
    [123.65966678273077, -33.89017913181271],
    [124.02894656788851, -33.4838473447017],
    [124.22164798390492, -32.95948658623607],
    [125.08862348846566, -32.72875131605285],
    [126.14871382050114, -32.21596607842059]
];

function parsePoints(data) {
    return data.map(d => {
        // @ts-ignore
        return new poly2tri.Point(d[0], d[1]);
    });
}

// australia
let australiaPoly2triContour = parsePoints(australia);
// @ts-ignore
const australiaPoly2triSwctx = new poly2tri.SweepContext(australiaPoly2triContour);

australiaPoly2triSwctx.triangulate();

let australiaPoly2triTriangles = australiaPoly2triSwctx.getTriangles() || [];

let australiaData = australiaPoly2triTriangles
    .map(d => {
        return d.points_.map(p => {
            return [p.x, p.y];
        });
    })
    .flat();

// tasmania
let tasmaniaPoly2triContour = parsePoints(tasmania);
// @ts-ignore
const tasmaniaPoly2triSwctx = new poly2tri.SweepContext(tasmaniaPoly2triContour);

tasmaniaPoly2triSwctx.triangulate();

let tasmaniaPoly2triTriangles = tasmaniaPoly2triSwctx.getTriangles() || [];

let tasmaniaData = tasmaniaPoly2triTriangles
    .map(d => {
        return d.points_.map(p => {
            return [p.x, p.y];
        });
    })
    .flat();

async function australiaMap(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const growBy = new NumberRange(0.1, 0.1);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

    const dataSeriesAustralia = new XyDataSeries(wasmContext, {
        xValues: australiaData.map(p => p[0]),
        yValues: australiaData.map(p => p[1])
    });

    const triangleSeriesAustralia = new TriangleRenderableSeries(wasmContext, {
        dataSeries: dataSeriesAustralia,
        drawMode: ETriangleSeriesDrawMode.List, // triangle connects two last points and the first point
        fill: "cornflowerblue",
        opacity: 0.5
    });

    const dataSeriesTasmania = new XyDataSeries(wasmContext, {
        xValues: tasmaniaData.map(p => p[0]),
        yValues: tasmaniaData.map(p => p[1])
    });

    const triangleSeriesTasmania = new TriangleRenderableSeries(wasmContext, {
        dataSeries: dataSeriesTasmania,
        drawMode: ETriangleSeriesDrawMode.List, // triangle connects two last points and the first point
        fill: "cornflowerblue",
        polygonVertices: 0, // Sets the number of vertices per polygon. Applies only for drawMode ETriangleSeriesDrawMode.Polygon
        opacity: 0.5
    });

    sciChartSurface.renderableSeries.add(triangleSeriesAustralia);
    sciChartSurface.renderableSeries.add(triangleSeriesTasmania);

    // Add zoom/pan controls
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());

    return sciChartSurface;
}

australiaMap("scichart-root");
