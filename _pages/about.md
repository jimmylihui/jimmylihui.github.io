---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

Hi there👋I am Jiahui Li, a Ph.D. student in Computer Science at the University of Georgia, supervised by Dr. Fei Dou. I obtained my M.Sc. in Scientific and Data-Intensive Computing from University College London and my B.Sc. in Computer Science and Engineering from the University of Liverpool.

My research focuses on **evidence-grounded and explainable artificial intelligence for clinical diagnosis and health sensing**, including multimodal clinical reasoning, physiological time-series modeling, and trustworthy evaluation. My work spans electrocardiography (ECG), photoplethysmography (PPG), ballistocardiography (BCG), bodyseismography (BSG), vision-language models, and instruction-tuned large language models. Previously, I was a research assistant at the Hong Kong University of Science and Technology, working with Prof. Dit-Yan Yeung.

<span style="color:red">I am always open to research collaborations — feel free to reach out!</span>

📄 [**Download my CV (PDF)**](/files/CV_Jiahui_Li.pdf) &nbsp;·&nbsp; [View CV online](/cv/)


# 📝 Selected Publications

<small>∗ equal contribution, † corresponding author. Author names in <strong>bold</strong> indicate myself.</small>

<div class='paper-box'>
<div class='paper-box-image'><div>
  <img src='images/papers/deeparrhythmia.png' alt="sym" width="78%">
</div></div>

<div class='paper-box-text' markdown="1">

[DeepArrhythmia: Segment-Contextualized ECG Arrhythmia Classification via Selective Evidence Acquisition](https://arxiv.org/abs/2605.16441)<br>
**Jiahui Li**, Ruili Fang, Zishuai Liu, Wenzhan Song, Jin Lu, Fei Dou†<br>
*NeurIPS 2026*. [[pdf](https://arxiv.org/pdf/2605.16441)]

</div>
</div>


<div class='paper-box'>
<div class='paper-box-image'><div>
  <img src='images/papers/peak-detector.png' alt="sym" width="78%">
</div></div>

<div class='paper-box-text' markdown="1">

[Peak-Detector: Explainable Peak Detection via Instruction-Tuned Large Language Models in Physiological Signal](https://dl.acm.org/doi/10.1145/3810224)<br>
**Jiahui Li**, Yida Zhang, Zixuan Zeng, Jiayu Chen, Yingjian Song, Yin Xiao, Nishan Dong, Junjie Lu, Younghoon Kwon, Xiang Zhang, Jin Lu, Wenzhan Song, Fei Dou†<br>
*ACM IMWUT (UbiComp) 2026*. [[paper](https://dl.acm.org/doi/10.1145/3810224)] [[arXiv](https://arxiv.org/abs/2605.16452)]

</div>
</div>


<div class='paper-box'>
<div class='paper-box-image'><div>
  <img src='images/papers/adlgen.png' alt="sym" width="78%">
</div></div>

<div class='paper-box-text' markdown="1">

[ADLGen: Synthesizing Symbolic, Event-Triggered Sensor Sequences for Smart-Home Human Activity Modeling](https://dl.acm.org/doi/10.1145/3774906.3802796)<br>
Weihang You∗, Hanqi Jiang∗, **Jiahui Li**∗ <em>(co-first author)</em>, Zishuai Liu∗, Tianming Liu, Jin Lu, Fei Dou†<br>
*ACM SenSys 2026*. [[paper](https://dl.acm.org/doi/10.1145/3774906.3802796)]

</div>
</div>


<div class='paper-box'>
<div class='paper-box-image'><div>
  <img src='images/papers/earlydx.png' alt="sym" width="78%">
</div></div>

<div class='paper-box-text' markdown="1">

[EarlyDx: An Admission-Anchored Benchmark for Open-Ended Generation of Evidence-Supported ED-Encounter Diagnoses](https://arxiv.org/abs/2607.28788)<br>
**Jiahui Li**, Ruili Fang, Zishuai Liu, Yutong Guo, Nan Yang, Wenzhan Song, Jin Lu, Fei Dou†<br>
*Preprint*, 2026. [[pdf](https://arxiv.org/pdf/2607.28788)]

</div>
</div>


<div class='paper-box'>
<div class='paper-box-image'><div>
  <img src='images/papers/peak-r1.png' alt="sym" width="78%">
</div></div>

<div class='paper-box-text' markdown="1">

[Peak-R1: Instruction-Tuned Large Language Models for Robust J-Peak Detection](https://openreview.net/forum?id=jSW3GZQoVJ)<br>
**Jiahui Li**, Yida Zhang, Zixuan Zeng, Jiayu Chen, Xiang Zhang, Jin Lu, Wenzhan Song, Fei Dou†<br>
*Learning from Time Series for Health Workshop @ NeurIPS 2025*. [[openreview](https://openreview.net/forum?id=jSW3GZQoVJ)]

</div>
</div>


<div class='paper-box'>
<div class='paper-box-image'><div>
  <img src='images/papers/alignment.png' alt="sym" width="78%">
</div></div>

<div class='paper-box-text' markdown="1">

[Alignment and Safety in Large Language Models: Safety Mechanisms, Training Paradigms, and Emerging Challenges](https://arxiv.org/abs/2507.19672)<br>
Haoran Lu, Luyang Fang, Ruidong Zhang, and others, including **Jiahui Li**<br>
*Preprint*, 2025. [[pdf](https://arxiv.org/pdf/2507.19672)]

</div>
</div>


<div class='paper-box'>
<div class='paper-box-image'><div>
  <img src='images/papers/genbench.png' alt="sym" width="78%">
</div></div>

<div class='paper-box-text' markdown="1">

[GenBench: A Benchmarking Suite for Systematic Evaluation of Genomic Foundation Models](https://arxiv.org/abs/2406.01627)<br>
Zicheng Liu, **Jiahui Li**, Siyuan Li, Zelin Zang, Cheng Tan, Yufei Huang, Yajing Bai, Stan Z. Li<br>
*Preprint*, 2024. [[pdf](https://arxiv.org/pdf/2406.01627)]

</div>
</div>


# 📚 Other Publications

- Yuanyuan Zhang, Yida Zhang, **Jiahui Li**, Yuyan Wu, Fei Dou, Xiao Yin, Zhenlin An, Hae Young Noh, Wenzhan Song. "[Physics-Constrained Deep Learning Model for Contactless Blood Pressure Monitoring from Triaxial Bodyseismography](https://arxiv.org/abs/2608.23562)." *arXiv preprint*, 2026. [[pdf](https://arxiv.org/pdf/2608.23562)]


# 📖 Education
- *Aug. 2024 - present*, University of Georgia, Ph.D. in Computer Science (GPA 4.00/4.00). Advisor: Dr. Fei Dou.
- *2021 - 2022*, University College London, M.Sc. in Scientific and Data-Intensive Computing (GPA 3.62/4.00).
- *2017 - 2021*, University of Liverpool, B.Sc. in Computer Science and Engineering (GPA 3.92/4.00).


# 💼 Experiences
- *Aug. 2024 - present*, **Graduate Research Assistant**, School of Computing, University of Georgia. Advisor: Dr. Fei Dou.
- *2023 - 2024*, **Research Assistant**, Hong Kong University of Science and Technology. Supervisor: Prof. Dit-Yan Yeung. Built MGTST, a multi-scale, cross-channel gated Transformer for multivariate long-term forecasting.


# 👨‍🏫 Teaching
- *Fall 2024, Spring 2025*, Teaching Assistant, CSCI 1302: Software Development, University of Georgia.
- *Fall 2025, Fall 2026*, Teaching Assistant, CSCI 4470: Algorithms, University of Georgia.
