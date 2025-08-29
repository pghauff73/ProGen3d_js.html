# ProGen3d_js.html
Visual Grammar Editor written in javascript as a standalone html file.
# ProGen3d_js — A Visual Grammar Engine for Procedural 3D Design
*By Pamela G. Hauff · 2025*

<div class="screenshot">
  <p>[ Screenshot Placeholder of ProGen3d_js Editor ]</p>
</div>

## Introduction
**ProGen3d_js** is the JavaScript adaptation of the ProGen3d visual grammar system: a procedural, rule-driven editor for creating 3D structures through symbolic expressions. Unlike traditional CAD or polygonal modeling tools, ProGen3d_js describes form through *grammar*. Each rule is a symbolic definition that can be combined, repeated, parameterized, or instantiated to create complex 3D outputs. In this article we will explore the grammar itself, the JavaScript implementation, the smart editor with syntax highlighting and tooltips, and the path forward with simulation and generative AI integration.

## The Visual Grammar at the Core
At the heart of ProGen3d_js lies a compact but powerful grammar. Each token has a specific geometric or procedural role:

- `A` — Rotate an object by angle and axis (0 = x, 1 = y, 2 = z).
- `T` — Translate an object along the three Cartesian axes.
- `S` — Scale an object by independent factors in x, y, z.
- `DS` — Dimensional scale (scale offset for parametric adjustments).
- `I` — Instantiate primitives such as `Cube`, `CubeX`, or `CubeY` with textures and scales.
- `R` — Define procedural variables with ranges (`R(0 10)`), or `R*` for integer ranges.

These constructs are combined inside rules: symbolic statements with a left-hand side (the rule name) and a right-hand side (the sequence of operations). Sections separated by `|` delimit pre, main, and post processing regions. This allows extremely concise definitions of objects that can be instantiated repeatedly with variations.

## Grammar Lexer and Parser in JavaScript
The JavaScript version implements its own `GrammarLexer` class. This lexer processes raw text into tokens, preserving whitespace (`WS`), newlines (`NL`), and comments (`CMT`) so that diagnostics and highlighting can be accurate. It detects numbers, signed numbers, identifiers, operators, and self-contained math expressions. It also enforces strict rules for `->` arrow operators, ensuring rule heads are unambiguous.

The parser then consumes these tokens through a `makeStreamFromLexer` wrapper that skips ignorable types. It offers safe accessors like `peekTok()`, `nextTok()`, and `nextTokReq()`. Together they provide a robust stream that can never stall on newlines or comments. Parsing builds `Rule` objects with pre|main|post sections, variable bindings, and optional alternates (for probabilistic grammar).

## Smart Editor: Syntax Highlighting and Tooltips
ProGen3d_js is not just a grammar engine; it comes with an integrated **smart editor**. This editor renders tokens on a parallel highlight layer. It clones text metrics, aligns layers precisely, and overlays squiggles for syntax errors. Rules are colored differently when defined versus referenced, and reachability analysis highlights which rules are active from the caret position.

Tooltips are another highlight. Hovering over a keyword produces a grammar-aware tooltip rather than a generic message. For example:

- **A:** *Rotate → A (angle, axis)*
- **T:** *Translate → T (x, y, z)*
- **I:** *Instantiate → I (Cube, CubeX, CubeY …)*
- **R:** *Procedural variable → R (min, max)*

These contextual explanations help new users learn the grammar while assisting experienced users with quick reminders of syntax and semantics.

## Error Handling and Diagnostics
The JavaScript engine performs real-time diagnostics. Mismatched parentheses or brackets are highlighted. Rule heads missing `->` are flagged. Newline placement is checked to prevent syntax errors. When errors occur, they are attached to visible tokens so the user can hover to see an error explanation. This provides an IDE-like experience for a custom grammar.

## Executing Tokens and Building a Scene
Beyond parsing, ProGen3d_js executes tokens into a scene. The `Token` class implements `performAction()`, applying transformations and instantiations to a context. For example, `A(45 0)` rotates the scope 45° around the X axis, while `T(1 2 3)` translates it. Instantiation tokens call `scene.add()` with the current transform, adding geometry primitives to the rendering pipeline.

Procedural variables declared by `R` are expanded by `addVariableInstance()`, supporting iteration across value ranges. The `Recurse()` function walks rule bodies, handles alternates with probabilities, and applies repeat counts, creating complex expansions from small symbolic seeds.

## Simulator Adjunct
A simulator runs alongside the editor. Every time grammar changes are made, the simulator applies tokens to a live 3D context. This validates that rotations, scales, and instantiations behave as expected. It also allows users to visualize procedural variables sweeping through their ranges, seeing multiple variations at once. This feedback loop is invaluable in design work, where intuition about scale and proportion must be constantly tested.

## Generative AI Integration (Future Work)
Looking ahead, ProGen3d_js is a strong candidate for integration with generative AI models. The symbolic grammar provides an ideal scaffold for AI to propose new rules or variations that remain syntactically valid. For example, an AI agent could suggest adding `DS` offsets to explore dimensional variations, or propose probabilistic alternates to diversify form. AI-driven search could traverse the procedural design space quickly, offering inspiration and unexpected solutions that the human designer can then refine.

## Applications in Design and Engineering
ProGen3d_js has clear applications in architectural design, product prototyping, robotics, and education. Its rule-driven approach allows for reproducibility—essential when designs must be tested and validated. In engineering, procedural grammars allow designers to encode constraints and ranges, generating multiple candidate solutions automatically. In education, the compact syntax provides a powerful way to teach transformations, coordinate systems, and parametric design.

## Conclusion
With ProGen3d_js, we see the merging of symbolic grammar, procedural generation, and modern web technologies. Its lexer and parser provide rigor; the smart editor delivers clarity; the simulator adjunct provides feedback; and future AI integration promises generativity. By exposing design intent in a concise grammar, ProGen3d_js empowers designers to work at the level of rules and constraints, rather than polygons and vertices. The result is design work that is reproducible, tunable, and creative.

In 2025 and beyond, this project stands as an innovative bridge between computation and creativity—demonstrating that grammar-based systems can underpin the next generation of design tools.
