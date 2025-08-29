# ProGen3d_js.html
Visual Grammar Editor written in javascript as a standalone html file.
<article class="pg3d-article">
  <header>
    <h1>ProGen3d_js — A Visual Grammar Engine for Procedural 3D Design</h1>
    <p class="subtitle">By Pamela G. Hauff · 2025</p>
  </header>

  <div class="screenshot">
    <!-- Replace with <img src="screenshot.png" alt="ProGen3d_js editor screenshot"> -->
    <p>[ Screenshot Placeholder of ProGen3d_js Editor ]</p>
  </div>

  <section>
    <h2>Introduction</h2>
    <p>
      <strong>ProGen3d_js</strong> is the JavaScript adaptation of the ProGen3d
      visual grammar system: a procedural, rule-driven editor for creating 3D
      structures through symbolic expressions. Unlike traditional CAD or polygonal
      modeling tools, ProGen3d_js describes form through <em>grammar</em>. Each
      rule is a symbolic definition that can be combined, repeated, parameterized,
      or instantiated to create complex 3D outputs. In this article we will
      explore the grammar itself, the JavaScript implementation, the smart editor
      with syntax highlighting and tooltips, and the path forward with simulation
      and generative AI integration.
    </p>
  </section>

  <section>
    <h2>The Visual Grammar at the Core</h2>
    <p>
      At the heart of ProGen3d_js lies a compact but powerful grammar. Each token
      has a specific geometric or procedural role. For instance:
    </p>
    <ul>
      <li><code>A</code> — Rotate an object by angle and axis (0 = x, 1 = y, 2 = z).</li>
      <li><code>T</code> — Translate an object along the three Cartesian axes.</li>
      <li><code>S</code> — Scale an object by independent factors in x, y, z.</li>
      <li><code>DS</code> — Dimensional scale (scale offset for parametric adjustments).</li>
      <li><code>I</code> — Instantiate primitives such as <code>Cube</code>, <code>CubeX</code>, or <code>CubeY</code> with textures and scales.</li>
      <li><code>R</code> — Define procedural variables with ranges (<code>R(0 10)</code>), or <code>R*</code> for integer ranges.</li>
    </ul>
    <p>
      These constructs are combined inside rules: symbolic statements with a
      left-hand side (the rule name) and a right-hand side (the sequence of
      operations). Sections separated by <code>|</code> delimit pre, main, and
      post processing regions. This allows extremely concise definitions of
      objects that can be instantiated repeatedly with variations.
    </p>
  </section>

  <section>
    <h2>Grammar Lexer and Parser in JavaScript</h2>
    <p>
      The JavaScript version implements its own <code>GrammarLexer</code> class.
      This lexer processes raw text into tokens, preserving whitespace
      (<code>WS</code>), newlines (<code>NL</code>), and comments (<code>CMT</code>)
      so that diagnostics and highlighting can be accurate. It detects numbers,
      signed numbers, identifiers, operators, and self-contained math expressions.
      It also enforces strict rules for <code>-&gt;</code> arrow operators, ensuring
      rule heads are unambiguous.
    </p>
    <p>
      The parser then consumes these tokens through a <code>makeStreamFromLexer</code>
      wrapper that skips ignorable types. It offers safe accessors like
      <code>peekTok()</code>, <code>nextTok()</code>, and <code>nextTokReq()</code>.
      Together they provide a robust stream that can never stall on newlines or
      comments. Parsing builds <code>Rule</code> objects with pre|main|post sections,
      variable bindings, and optional alternates (for probabilistic grammar).
    </p>
  </section>

  <section>
    <h2>Smart Editor: Syntax Highlighting and Tooltips</h2>
    <p>
      ProGen3d_js is not just a grammar engine; it comes with an integrated
      <strong>smart editor</strong>. This editor renders tokens on a parallel
      highlight layer. It clones text metrics, aligns layers precisely, and
      overlays squiggles for syntax errors. Rules are colored differently when
      defined versus referenced, and reachability analysis highlights which rules
      are active from the caret position.
    </p>
    <p>
      Tooltips are another highlight. Hovering over a keyword produces a
      grammar-aware tooltip rather than a generic message. For example:
    </p>
    <ul>
      <li><strong>A:</strong> <em>Rotate → A (angle, axis)</em></li>
      <li><strong>T:</strong> <em>Translate → T (x, y, z)</em></li>
      <li><strong>I:</strong> <em>Instantiate → I (Cube, CubeX, CubeY …)</em></li>
      <li><strong>R:</strong> <em>Procedural variable → R (min, max)</em></li>
    </ul>
    <p>
      These contextual explanations help new users learn the grammar while
      assisting experienced users with quick reminders of syntax and semantics.
    </p>
  </section>

  <section>
    <h2>Error Handling and Diagnostics</h2>
    <p>
      The JavaScript engine performs real-time diagnostics. Mismatched parentheses
      or brackets are highlighted. Rule heads missing <code>-&gt;</code> are flagged.
      Newline placement is checked to prevent syntax errors. When errors occur,
      they are attached to visible tokens so the user can hover to see an error
      explanation. This provides an IDE-like experience for a custom grammar.
    </p>
  </section>

  <section>
    <h2>Executing Tokens and Building a Scene</h2>
    <p>
      Beyond parsing, ProGen3d_js executes tokens into a scene. The <code>Token</code>
      class implements <code>performAction()</code>, applying transformations and
      instantiations to a context. For example, <code>A(45 0)</code> rotates the
      scope 45° around the X axis, while <code>T(1 2 3)</code> translates it.
      Instantiation tokens call <code>scene.add()</code> with the current transform,
      adding geometry primitives to the rendering pipeline.
    </p>
    <p>
      Procedural variables declared by <code>R</code> are expanded by
      <code>addVariableInstance()</code>, supporting iteration across value ranges.
      The <code>Recurse()</code> function walks rule bodies, handles alternates with
      probabilities, and applies repeat counts, creating complex expansions from
      small symbolic seeds.
    </p>
  </section>

  <section>
    <h2>Simulator Adjunct</h2>
    <p>
      A simulator runs alongside the editor. Every time grammar changes are made,
      the simulator applies tokens to a live 3D context. This validates that
      rotations, scales, and instantiations behave as expected. It also allows
      users to visualize procedural variables sweeping through their ranges,
      seeing multiple variations at once. This feedback loop is invaluable in
      design work, where intuition about scale and proportion must be constantly
      tested.
    </p>
  </section>

  <section>
    <h2>Generative AI Integration (Future Work)</h2>
    <p>
      Looking ahead, ProGen3d_js is a strong candidate for integration with
      generative AI models. The symbolic grammar provides an ideal scaffold for
      AI to propose new rules or variations that remain syntactically valid. For
      example, an AI agent could suggest adding <code>DS</code> offsets to explore
      dimensional variations, or propose probabilistic alternates to diversify
      form. AI-driven search could traverse the procedural design space quickly,
      offering inspiration and unexpected solutions that the human designer can
      then refine.
    </p>
  </section>

  <section>
    <h2>Applications in Design and Engineering</h2>
    <p>
      ProGen3d_js has clear applications in architectural design, product
      prototyping, robotics, and education. Its rule-driven approach allows for
      reproducibility—essential when designs must be tested and validated. In
      engineering, procedural grammars allow designers to encode constraints and
      ranges, generating multiple candidate solutions automatically. In education,
      the compact syntax provides a powerful way to teach transformations,
      coordinate systems, and parametric design.
    </p>
  </section>

  <section>
    <h2>Conclusion</h2>
    <p>
      With ProGen3d_js, we see the merging of symbolic grammar, procedural
      generation, and modern web technologies. Its lexer and parser provide rigor;
      the smart editor delivers clarity; the simulator adjunct provides feedback;
      and future AI integration promises generativity. By exposing design intent
      in a concise grammar, ProGen3d_js empowers designers to work at the level of
      rules and constraints, rather than polygons and vertices. The result is
      design work that is reproducible, tunable, and creative.
    </p>
    <p>
      In 2025 and beyond, this project stands as an innovative bridge between
      computation and creativity—demonstrating that grammar-based systems can
      underpin the next generation of design tools.
    </p>
  </section>
</article>
