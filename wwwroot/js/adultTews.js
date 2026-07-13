(function () {

    // ── TEWS scoring functions ────────────────────────────────────────────────

    function scoreRespRate(v) {
        if (v === '' || isNaN(v)) return null;
        v = parseFloat(v);
        if (v < 9)   return 3;
        if (v <= 14) return 0;
        if (v <= 20) return 1;
        if (v <= 29) return 2;
        return 3;
    }

    function scorePulse(v) {
        if (v === '' || isNaN(v)) return null;
        v = parseFloat(v);
        if (v < 41)   return 3;
        if (v <= 50)  return 2;
        if (v <= 100) return 0;
        if (v <= 110) return 1;
        if (v <= 129) return 2;
        return 3;
    }

    function scoreTemp(v) {
        if (v === '' || isNaN(v)) return null;
        v = parseFloat(v);
        if (v < 35)    return 2;
        if (v <= 38.4) return 0;
        return 2;
    }

    function scoreSBP(v) {
        if (v === '' || isNaN(v)) return null;
        v = parseFloat(v);
        if (v < 71)   return 3;
        if (v <= 80)  return 2;
        if (v <= 100) return 1;
        if (v <= 199) return 0;
        return 2;
    }

    function scoreMobility(v) {
        if (v === 'Walking')            return 0;
        if (v === 'With help')          return 1;
        if (v === 'Stretcher/Immobile') return 2;
        return null;
    }

    function scoreAVPU(v) {
        if (v === 'Alert')          return 0;
        if (v === 'Confused')       return 2;
        if (v === 'React to voice') return 1;
        if (v === 'React to pain')  return 2;
        if (v === 'Unresponsive')   return 3;
        return null;
    }

    function scoreTrauma(v) {
        if (v === '0') return 0;
        if (v === '1') return 1;
        return null;
    }

    // ── Helper: write to a readonly field ─────────────────────────────────────

    function setScore(fieldId, score) {
        const el = document.getElementById(fieldId);
        if (!el) return;
        el.value = score !== null ? score : '';
    }

    // ── Recalculate TEWS total ────────────────────────────────────────────────

    function recalculate() {
        const scores = {
            mobility: scoreMobility(document.getElementById('adultMobility')?.value),
            respRate: scoreRespRate(document.getElementById('adultRespRate')?.value),
            pulse:    scorePulse(document.getElementById('adultPulseRate')?.value),
            temp:     scoreTemp(document.getElementById('adultTewsTemp')?.value),
            sbp:      scoreSBP(document.getElementById('adultSBP')?.value),
            avpu:     scoreAVPU(document.getElementById('adultAVPU')?.value),
            trauma:   scoreTrauma(document.getElementById('adultTrauma')?.value),
        };

        setScore('adultMobilityScore', scores.mobility);
        setScore('adultRespScore',     scores.respRate);
        setScore('adultPulseScore',    scores.pulse);
        setScore('adultTempScore',     scores.temp);
        setScore('adultSBPScore',      scores.sbp);
        setScore('adultAVPUScore',     scores.avpu);
        setScore('adultTraumaScore',   scores.trauma);

        const values = Object.values(scores).filter(s => s !== null);
        const total  = values.reduce((sum, s) => sum + s, 0);

        // adultSubTotal row is commented out in HTML — only set TotalTews
        setScore('adultTotalTews', values.length ? total : null);
    }

    // ── Pain score: auto-select radio from face value ─────────────────────────

    function autoSelectPainScore(faceValue) {
        const v = parseInt(faceValue, 10);

        let target = null;
        if (v >= 0 && v <= 3)  target = 'Mild';
        if (v >= 4 && v <= 6)  target = 'Moderate';
        if (v >= 7 && v <= 10) target = 'Severe';

        if (!target) return;

        // find the radio with matching value and check it
        const radios = document.querySelectorAll(
            '#adult-form input[type="radio"][name="PainScore"]'
        );
        radios.forEach(radio => {
            radio.checked = (radio.value === target);
        });

        // also highlight the pain score label visually
        document.querySelectorAll('#adult-form .pain-score-option').forEach(opt => {
            opt.classList.toggle('active', opt.querySelector('input')?.value === target);
        });
    }

    // ── Face buttons ──────────────────────────────────────────────────────────

    function attachFaceButtons() {
        document.querySelectorAll('#adultFacesScale .face-btn').forEach(btn => {
            btn.addEventListener('click', function () {

                // 1. Highlight the clicked face
                document.querySelectorAll('#adultFacesScale .face-btn')
                        .forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');

                // 2. Store value in hidden field
                const hidden = document.getElementById('adultFacePainScore');
                if (hidden) hidden.value = this.dataset.value;

                // 3. Auto-select the pain score radio
                autoSelectPainScore(this.dataset.value);
            });
        });
    }

    // ── TEWS input listeners ──────────────────────────────────────────────────

    function attachListeners() {
        const targets = [
            'adultMobility', 'adultRespRate', 'adultPulseRate',
            'adultTewsTemp', 'adultSBP', 'adultAVPU', 'adultTrauma'
        ];

        targets.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', recalculate);
            } else {
                console.warn(`adultTews.js: element #${id} not found.`);
            }
        });
    }

    // ── Init ──────────────────────────────────────────────────────────────────

    function init() {
        attachListeners();
        attachFaceButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();