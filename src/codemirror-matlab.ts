import CodeMirror from 'codemirror';
import 'codemirror/mode/meta';

interface tokenizeStringStream extends CodeMirror.StringStream {
    tokenize: (stream:tokenizeStringStream, state:StateInterface) => any;
  }
  
export interface StateInterface {
    tokenize: (stream:tokenizeStringStream, state:StateInterface) => any;
  }

export function MATLAB_mode(conf: CodeMirror.EditorConfiguration, parserConf:any) {

	function wordRegexp(words:Array<string>) {
		return new RegExp("^((" + words.join(")|(") + "))\\b");
	}

  var singleOperators = new RegExp("^[\\+\\-\\*/&|\\^~<>!@'\\\\]");
  var singleDelimiters = new RegExp('^[\\(\\[\\{\\},:=;\\.]');
  var doubleOperators = new RegExp("^((==)|(~=)|(<=)|(>=)|(<<)|(>>)|(\\.[\\+\\-\\*/\\^\\\\]))");
  var doubleDelimiters = new RegExp("^((!=)|(\\+=)|(\\-=)|(\\*=)|(/=)|(&=)|(\\|=)|(\\^=))");
  var tripleDelimiters = new RegExp("^((>>=)|(<<=))");
  var expressionEnd = new RegExp("^[\\]\\)]");
  var identifiers = new RegExp("^[_A-Za-z\xa1-\uffff][_A-Za-z0-9\xa1-\uffff]*");

  var builtins = wordRegexp([
    'dbclear','dbcont','dbdown','dbquit','dbstack','dbstatus','dbstep','dbtype','dbup','conv2','cummax',
    'cummin','cumprod','cumsum','diff','fft','fftn','filter','histc','issorted','issortedrows','max','maxk',
    'min','mink','prod','sort','sum','cast','cell','cell2struct','class','enumeration','fieldnames','functions',
    'inferiorto','int16','int32','int64','int8','isa','isfloat','isinteger','islogical','javaMethodEDT',
    'javaObjectEDT','logical','metaclass','namedargs2cell','single','struct','struct2cell','structfun',
    'superclasses','superiorto','typecast','uint16','uint32','uint64','uint8','isKey','isempty','keys',
    'length','remove','size','subsasgn','subsref','values','preloadWhichCache','abs','acos','acosd','acosh',
    'acot','acotd','acoth','acsc','acscd','acsch','asec','asecd','asech','asin','asind','asinh','atan','atan2',
    'atan2d','atand','atanh','ceil','complex','conj','cos','cosd','cosh','cospi','exp','expm1','fix','floor',
    'hypot','imag','isreal','log','log10','log1p','log2','mod','pow2','real','rem','round','sign','sin',
    'sind','sinh','sinpi','sqrt','tan','tand','tanh','bsxfun','cat','diag','eps','eye','false','find',
    'flintmax','i','inf','intmax','intmin','iscolumn','isempty','isequal','isequaln','isequalwithequalnans',
    'isfinite','isinf','ismatrix','isnan','isrow','isscalar','isvector','j','length','nan','ndims','numel',
    'ones','permute','pi','realmax','realmin','reshape','size','tril','triu','true','zeros',
    'batchStartupOptionUsed','beep','calllib','cd','clear','computer','copyfile','delete','diary','dir',
    'echo','exit','format','getenv','getmcruserdata','import','inmem','isfile','isfolder','ismcc','isstudent',
    'load','matlabpath','mexext','mkdir','more','movefile','namelengthmax','pack','quit','recycle','rehash',
    'rmdir','setenv','setmcruserdata','type','what','which','who','whos','loglog','plot','semilogx','semilogy',
    'fill3','plot3','addpoints','animatedline','clearpoints','drawnow','figure','getpoints','hgclose',
    'uicontextmenu','uicontrol','uimenu','axes','polaraxes','copyobj','get','getappdata','groot',
    'handle2struct','isappdata','isnumeric','ishandle','reset','set','setappdata','struct2handle','hggroup',
    'hgtransform','light','line','patch','rectangle','surface','text','lookfor','clc','fclose',
    'feof','ferror','fgets','fprintf','fscanf','fseek','ftell','fwrite','home','Contents','ans','arguments',
    'assignin','break','builtin','disp','display','error','eval','evalin','exist','feval','for','input',
    'inputname','keyboard','lasterr','lasterror','lastwarn','localfunctions','mfilename','mislocked',
    'mlock','munlock','nargchk','nargin','narginchk','nargout','nargoutchk','rethrow','varargin',
    'varargout','warning','hasListener','AppendArgumentsCorrection','ConvertToFunctionNotationCorrection',
    'ReplaceIdentifierCorrection','Correction','copy','copyElement','get','getdisp','set','setdisp','get',
    'set','addCause','addCorrection','eq','getReport','isequal','last','ne','rethrow','throw','throwAsCaller',
    'delete','eq','findobj','findprop','ge','gt','isvalid','le','lt','ne','notify','addOptional',
    'addParameter','addRequired','parse','balance','bandwidth','chol','cholupdate','det','eig','hess',
    'inv','isbanded','isdiag','ishermitian','issymmetric','istril','istriu','ldl','linsolve','ltitr',
    'lu','norm','ordeig','ordqz','ordschur','qr','qrupdate','qz','rcond','svd','vecnorm','all','any',
    'numArgumentsFromSubscript','subsasgn','subsref','convhull','delaunay','convexHull','inOutStatus',
    'nearestNeighbor','pointLocation','voronoiDiagram','baryToCart','cartToBary','circumcenters',
    'edgeAttachments','edges','faceNormals','featureEdges','freeBoundary','incenters','isEdge','neighbors',
    'vertexAttachments','boundaryFacets','convexHull','delaunayTriangulation','barycentricToCartesian',
    'cartesianToBarycentric','circumcenter','edgeAttachments','edges','faceNormal','featureEdges',
    'freeBoundary','incenter','isConnected','nearestNeighbor','neighbors','pointLocation','vertexAttachments',
    'vertexNormal','randi','randn','amd','dissect','dmperm','etree','full','ichol','issparse','nnz',
    'nonzeros','nzmax','sparse','speye','symbfact','symrcm','airy','besselh','besseli','besselj',
    'besselk','bessely','erf','erfc','erfcinv','erfcx','erfinv','psi','colstyle','contourc','fill',
    'frame2im','im2frame','image','char','findstr','iscellstr','ischar','isletter','isspace','isstr',
    'isstring','native2unicode','newline','setstr','sprintf','sscanf','strcmp','strcmpi','strfind',
    'strncmp','strncmpi','strrep','unicode2native','sort','clock','cputime','pause','tic','toc','uicontainer',
    'uiflowcontainer','uigetdir','uigridcontainer','uipanel','uipushtool','uisetcolor','uisetfont','uitable',
    'uitoggletool','uitoolbar','waitfor','waitforbuttonpress','ddeadv','ddeexec','ddeinit','ddepoke','ddereq',
    'ddeterm','ddeunadv'
    ]);

var keywords = wordRegexp([
	'return', 'case', 'switch', 'else', 'elseif', 'end', 'if', 'otherwise', 'for', 'while',
	'try', 'catch', 	'classdef', 'properties', 'events', 'methods', 'global', 'persistent',
	'parfor', 'continue', 'function'
  ]);


// tokenizers
function tokenTranspose(stream:tokenizeStringStream, state:StateInterface) {
  if (!stream.sol() && stream.peek() === '\'') {
    stream.next();
    state.tokenize = tokenBase;
    return 'operator';
  }
  state.tokenize = tokenBase;
  return tokenBase(stream, state);
}


function tokenComment(stream:tokenizeStringStream, state:StateInterface) {
  if (stream.match(/^.*%}/)) {
    state.tokenize = tokenBase;
    return 'comment';
  };
  stream.skipToEnd();
  return 'comment';
}

function tokenBase(stream:tokenizeStringStream, state:StateInterface) {
  // whitespaces
  if (stream.eatSpace()) return null;

  // Handle one line Comments
  if (stream.match('%{')){
    state.tokenize = tokenComment;
    stream.skipToEnd();
    return 'comment';
  }

  if (stream.match(/^[%#]/)){
    stream.skipToEnd();
    return 'comment';
  }

  // Handle Number Literals
  if (stream.match(/^[0-9\.+-]/, false)) {
    if (stream.match(/^[+-]?0x[0-9a-fA-F]+[ij]?/)) {
      stream.tokenize = tokenBase;
      return 'number'; };
      if (stream.match(/^[+-]?\d*\.\d+([EeDd][+-]?\d+)?[ij]?/)) { return 'number'; };
      if (stream.match(/^[+-]?\d+([EeDd][+-]?\d+)?[ij]?/)) { return 'number'; };
    }
    if (stream.match(wordRegexp(['nan','NaN','inf','Inf']))) { return 'number'; };

    // Handle Strings
    var m = stream.match(/^"(?:[^"]|"")*("|$)/) || stream.match(/^'(?:[^']|'')*('|$)/)
    if (m) { return m[1] ? 'string' : "string error"; }

    // Handle words
    if (stream.match(keywords)) { return 'keyword'; } ;
    if (stream.match(builtins)) { return 'builtin'; } ;
    if (stream.match(identifiers)) { return 'variable'; } ;

    if (stream.match(singleOperators) || stream.match(doubleOperators)) { return 'operator'; };
    if (stream.match(singleDelimiters) || stream.match(doubleDelimiters) || stream.match(tripleDelimiters)) { return null; };

    if (stream.match(expressionEnd)) {
      state.tokenize = tokenTranspose;
      return null;
    };


    // Handle non-detected items
    stream.next();
    return 'error';
  };

  return {
    startState: function() {
      return {
        tokenize: tokenBase
      };
    },

    token: function(stream:any, state:any) {
      var style = state.tokenize(stream, state);
      if (style === 'number' || style === 'variable'){
        state.tokenize = tokenTranspose;
      }
      return style;
    },

    lineComment: '%',

    fold: 'indent'
  };
};
