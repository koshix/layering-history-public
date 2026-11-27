export default function StartupStatus({
  error = false,
}) {
  return (
    <section
      id="startup-status"
      role={error ? "alert" : "status"}
      style={{
        padding: "24px 16px",
        margin: "12px 0 24px",
        border: "1px solid #e2e4e8",
        borderRadius: 12,
        background: "#ffffff",
        color: "#59616c",
        fontSize: 14,
        lineHeight: 1.7,
      }}
    >
      <div id="startup-message">
        {error
          ? "年表データを読み込めませんでした。"
            + "通信状態を確認してください。"
          : "年表データを読み込んでいます…"}
      </div>

      {error && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{ marginTop: 10 }}
        >
          再読み込み
        </button>
      )}
    </section>
  );
}
