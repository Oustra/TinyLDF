
const queries = [
  { subject: 'http://example.org/netflix/s10', predicate: 'https://schema.org/actor', object: 'http://example.org/netflix/person/Kimberly_Quinn', Graph: 'https://example.com/netflix', offset: 0, limit: 10 },
  { subject: 'http://example.org/netflix/s10', predicate: 'https://schema.org/actor', object: 'http://example.org/netflix/person/Laura_Harrier', Graph: 'https://example.com/netflix', offset: 0, limit: 10 },
  { subject: 'http://example.org/netflix/s10', predicate: 'https://schema.org/actor', object: 'http://example.org/netflix/person/Loretta_Devine', Graph: 'https://example.com/netflix', offset: 0, limit: 10 },
  { subject: 'http://example.org/netflix/s6157', predicate: 'https://schema.org/actor', object: 'http://example.org/netflix/person/Xi_Man_Ning', Graph: 'https://example.com/netflix', offset: 0, limit: 10 },
  { subject: 'http://example.org/netflix/s6158', predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', object: 'https://schema.org/Movie', Graph: 'https://example.com/netflix', offset: 0, limit: 10 },
  { subject: 'http://example.org/netflix/s6158', predicate: 'https://dbpedia.org/ontology/country', object: 'http://dbpedia.org/resource/United_States', Graph: 'https://example.com/netflix', offset: 0, limit: 10 },
  { subject: 'http://example.org/netflix/s4580', predicate: 'https://schema.org/director', object: 'http://example.org/netflix/person/Aziz_Mirza', Graph: 'https://example.com/netflix', offset: 0, limit: 10 },
  { subject: 'http://example.org/netflix/s4581', predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', object: 'https://schema.org/Movie', Graph: 'https://example.com/netflix', offset: 0, limit: 10 },
  { subject: 'http://example.org/netflix/s4581', predicate: 'https://dbpedia.org/ontology/country', object: 'http://dbpedia.org/resource/India', Graph: 'https://example.com/netflix', offset: 0, limit: 10 },
  { subject: 'http://example.org/netflix/s8051', predicate: 'https://dbpedia.org/ontology/country', object: 'http://dbpedia.org/resource/Mexico', Graph: 'https://example.com/netflix', offset: 0, limit: 10 },
  { subject: 'http://example.org/netflix/s8051', predicate: 'https://schema.org/actor', object: 'http://example.org/netflix/person/Astrid_Hadad', Graph: 'https://example.com/netflix', offset: 0, limit: 10 },
  { subject: 'http://example.org/netflix/s8051', predicate: 'https://schema.org/actor', object: 'http://example.org/netflix/person/Carlos_Nakasone', Graph: 'https://example.com/netflix', offset: 0, limit: 10 },
  { subject: 'http://example.org/netflix/s2702', predicate: 'https://schema.org/actor', object: 'http://example.org/netflix/person/Noah_Ringer', Graph: 'https://example.com/netflix', offset: 0, limit: 10 },
  { subject: 'http://example.org/netflix/s2702', predicate: 'https://schema.org/actor', object: 'http://example.org/netflix/person/Seychelle_Gabriel', Graph: 'https://example.com/netflix', offset: 0, limit: 10 },
  { subject: 'http://example.org/netflix/s2702', predicate: 'https://schema.org/actor', object: 'http://example.org/netflix/person/Shaun_Toub', Graph: 'https://example.com/netflix', offset: 0, limit: 10 }
];

function calculateStats(times) {
  const n = times.length;
  const mean = times.reduce((a, b) => a + b, 0) / n;
  const variance = times.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);
  return { mean, stdDev };
}

const PerformanceApp = {
  data: [],
  loading: false,
  results: [],
  runTests: function () {
      this.loading = true;
      this.results = [];
      const promises = queries.map((query) => {
          const queryParams = [];
          if (query.subject) queryParams.push(`subject=${encodeURIComponent(query.subject)}`);
          if (query.predicate) queryParams.push(`predicate=${encodeURIComponent(query.predicate)}`);
          if (query.object) queryParams.push(`object=${encodeURIComponent(query.object)}`);
          if (query.Graph) queryParams.push(`Graph=${encodeURIComponent(query.Graph)}`);
          queryParams.push(`offset=${query.offset}`);
          queryParams.push(`limit=${query.limit}`);
          const queryString = '?' + queryParams.join('&');

          const startTime = performance.now();

          return m.request({
              method: "GET",
              url: `_ah/api/myApi/v1/searchTriplet${queryString}`
          }).then(() => {
              const endTime = performance.now();
              this.results.push(endTime - startTime);
          }).catch(() => {
              this.results.push(null); // Indicate failure for this query
          });
      });

      Promise.all(promises).then(() => {
          this.data = calculateStats(this.results.filter((t) => t !== null));
          this.loading = false;
          m.redraw();
      });
  },
  view: function () {
    return m("div", { style: { padding: "20px", fontFamily: "Arial" } }, [
        m("h1", "Performance Metrics"),
        m("button", {
            onclick: () => this.runTests(),
            disabled: this.loading
        }, this.loading ? "Running..." : "Run Performance Test"),
        m("div", { style: { marginTop: "20px" } },
            this.results.length > 0 ? [
                m("h3", "Results:"),
                m("p", `Average Time: ${this.data.mean !== undefined ? this.data.mean.toFixed(2) + " ms" : "N/A"}`),
                m("p", `Standard Deviation: ${this.data.stdDev !== undefined ? this.data.stdDev.toFixed(2) + " ms" : "N/A"}`),
                m("ul",
                    this.results.map((time, index) =>
                        m("li", `Query ${index + 1}: ${time !== null ? `${time.toFixed(2)} ms` : "Failed"}`)
                    )
                )
            ] : m("p", "No results yet.")
        )
    ]);
  }
};

m.mount(document.getElementById("app"), PerformanceApp);