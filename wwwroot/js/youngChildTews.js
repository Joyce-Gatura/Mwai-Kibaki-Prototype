(function () {

    // ── Scoring functions (Young Child TEWS 0–3 years) ───────────────────────

    function scoreMobility(v) {
        if (v === 'Normal') return 0;
        if (v === 'Unable') return 2;
        return null;
    }

    function scoreRespRate(v) {
        if (v === '' || isNaN(v)) return null;
        v = parseFloat(v);
        if (v < 20)  return 3;
        if (v <= 25) return 2;
        if (v <= 39) return 0;
        if (v <= 49) return 1;
        return 3;
    }

    function scorePulse(v) {
        if (v === '' || isNaN(v)) return null;
        v = parseFloat(v);
        if (v < 70)   return 3;
        if (v <= 79)  return 2;
        if (v <= 130) return 0;
        if (v <= 159) return 1;
        return 3;
    }

    function scoreTemp(v) {
        if (v === '' || isNaN(v)) return null;
        v = parseFloat(v);
        if (v < 35)    return 2;
        if (v <= 38.4) return 0;
        return 2;
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

    // ── Helper: write score to readonly field ─────────────────────────────────

    function setScore(fieldId, score) {
        const el = document.getElementById(fieldId);
        if (!el) return;
        el.value = score !== null ? score : '';
    }

    // ── Recalculate all scores and total ──────────────────────────────────────

    function recalculate() {
        const scores = {
            mobility: scoreMobility(document.getElementById('ychildMobility')?.value),
            respRate: scoreRespRate(document.getElementById('ychildRespRate')?.value),
            pulse:    scorePulse(document.getElementById('ychildPulseRate')?.value),
            temp:     scoreTemp(document.getElementById('ychildTewsTemp')?.value),
            avpu:     scoreAVPU(document.getElementById('ychildAVPU')?.value),
            trauma:   scoreTrauma(document.getElementById('ychildTrauma')?.value),
        };

        setScore('ychildMobilityScore', scores.mobility);
        setScore('ychildRespScore',     scores.respRate);
        setScore('ychildPulseScore',    scores.pulse);
        setScore('ychildTempScore',     scores.temp);
        setScore('ychildAVPUScore',     scores.avpu);
        setScore('ychildTraumaScore',   scores.trauma);

        const values = Object.values(scores).filter(s => s !== null);
        const total  = values.reduce((sum, s) => sum + s, 0);

        setScore('ychildTotalTews', values.length ? total : null);
    }

    // ── Pain score: auto-select radio from face value ─────────────────────────

    function autoSelectPainScore(faceValue) {
        const v = parseInt(faceValue, 10);

        let target = null;
        if (v >= 0 && v <= 3)  target = 'Mild';
        if (v >= 4 && v <= 6)  target = 'Moderate';
        if (v >= 7 && v <= 10) target = 'Severe';

        if (!target) return;

        document.querySelectorAll('#young-child-form input[type="radio"][name="PainScore"]')
            .forEach(radio => {
                radio.checked = (radio.value === target);
            });

        document.querySelectorAll('#young-child-form .pain-score-option').forEach(opt => {
            opt.classList.toggle('active', opt.querySelector('input')?.value === target);
        });
    }

    // ── Face pain scale buttons ───────────────────────────────────────────────

    function attachFaceButtons() {
        document.querySelectorAll('#ychildFacesScale .face-btn').forEach(btn => {
            btn.addEventListener('click', function () {

                // 1. Highlight selected face
                document.querySelectorAll('#ychildFacesScale .face-btn')
                        .forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');

                // 2. Store in hidden field
                const hidden = document.getElementById('ychildFacePainScore');
                if (hidden) hidden.value = this.dataset.value;

                // 3. Auto-select pain score radio
                autoSelectPainScore(this.dataset.value);
            });
        });
    }

    // ── Attach TEWS input listeners ───────────────────────────────────────────

    function attachListeners() {
        const targets = [
            'ychildMobility', 'ychildRespRate', 'ychildPulseRate',
            'ychildTewsTemp', 'ychildAVPU', 'ychildTrauma'
        ];

        targets.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', recalculate);
            } else {
                console.warn(`youngChildTews.js: element #${id} not found.`);
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