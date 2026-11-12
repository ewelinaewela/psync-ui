import { getOperator } from "../lib/operator.mjs";

export function OperatorDetails() {
  const operator = getOperator();
  const complete = Object.values(operator).every(Boolean);
  return (
    <section aria-labelledby="operator-heading">
      <h2 id="operator-heading">Psync operator and contact</h2>
      {!complete && <p className="policy-draft">Draft: public company and contact details must be confirmed before paid access opens.</p>}
      <dl className="operator-details">
        <div><dt>Company</dt><dd>{operator.name || "Awaiting confirmation"}</dd></div>
        <div><dt>UK company number</dt><dd>{operator.number || "Awaiting confirmation"}</dd></div>
        <div><dt>Correspondence address</dt><dd>{operator.address || "Awaiting confirmation"}</dd></div>
        <div><dt>Email</dt><dd>{operator.email ? <a href={`mailto:${operator.email}`}>{operator.email}</a> : "Awaiting confirmation"}</dd></div>
      </dl>
    </section>
  );
}
