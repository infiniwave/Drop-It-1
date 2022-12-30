export function Countdown({ currentDate, targetDate }: { currentDate: Date; targetDate: Date | null }) {
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const dateDiff = targetDate != null ? Math.max(targetDate.getTime() - currentDate.getTime(), 0) : 0;

  const date = new Date(dateDiff);
  const milliseconds = date.getMilliseconds();
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = Math.floor(dateDiff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(dateDiff / (1000 * 60 * 60 * 24));

  return (
    <div class="countdown">
      <header class="countdown__header">
        <h1 class="countdown__title">Drop It</h1>
      </header>
      <ol class="countdown__list">
        <li class="countdown__item">
          <span class="countdown__time">{days}</span>
          <span class="countdown__label">days</span>
        </li>
        <li class="countdown__item">
          <span class="countdown__time">{hours}</span>
          <span class="countdown__label">hours</span>
        </li>
        <li class="countdown__item">
          <span class="countdown__time">{minutes}</span>
          <span class="countdown__label">minutes</span>
        </li>
        <li class="countdown__item">
          <span class="countdown__time">{seconds}</span>
          <span class="countdown__label">seconds</span>
        </li>
        <li class="countdown__item">
          <span class="countdown__time">{milliseconds}</span>
          <span class="countdown__label">milliseconds</span>
        </li>
      </ol>
      <div class="countdown__current">
        <span class="countdown__current-time">{dateFormatter.format(currentDate)}</span>
      </div>
    </div>
  );
}
