/* http://www.opensource.apple.com/source/JavaScriptCore/ */

/* %start Program */

%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
[a-zA-Z]+\b           return 'STRING'
"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"^"                   return '^'
"!"                   return '!'
"%"                   return '%'
"("                   return '('
")"                   return ')'
"PI"                  return 'PI'
"E"                   return 'E'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex
%%

AdditiveLiteral
    : NUMBER '+' NUMBER
    ;
    
MultiplicativeLiteral
    : NUMBER '*' NUMBER
    ;
