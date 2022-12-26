export function Countdown({ currentDate, targetDate }: { currentDate: Date; targetDate: Date | null }) {
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const dateDiff = targetDate != null ? Math.max(targetDate.getTime() - currentDate.getTime(), 0) : 0;

  const milliseconds = dateDiff % 1000;

  let reducer = targetDate != null ? dateDiff / 1000 : 0;
  const seconds = Math.ceil(reducer % 60);
  reducer /= 60;
  const minutes = Math.max(Math.ceil(reducer % 60) - 1, 0);
  reducer /= 60;
  const hours = Math.round(reducer % 24);
  reducer /= 24;
  const days = Math.round(reducer);

  return (
    <div className="countdown">
      <header className="countdown__header">
        <h1 className="countdown__title">Drop It</h1>
      </header>
      <ol className="countdown__list">
        <li className="countdown__item">
          <span className="countdown__time">{days}</span>
          <span className="countdown__label">days</span>
        </li>
        <li className="countdown__item">
          <span className="countdown__time">{hours}</span>
          <span className="countdown__label">hours</span>
        </li>
        <li className="countdown__item">
          <span className="countdown__time">{minutes}</span>
          <span className="countdown__label">minutes</span>
        </li>
        <li className="countdown__item">
          <span className="countdown__time">{seconds}</span>
          <span className="countdown__label">seconds</span>
        </li>
        <li className="countdown__item">
          <span className="countdown__time">{milliseconds}</span>
          <span className="countdown__label">milliseconds</span>
        </li>
      </ol>
      <div className="countdown__current">
        <span className="countdown__current-time">{dateFormatter.format(currentDate)}</span>
      </div>
    </div>
  );
}
