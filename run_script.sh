#!/usr/bin/env bash

cat > $PWD/Web01/api.sh << EOF
#!/usr/bin/env bash
API_PORT=5001 python3 -m api.v1.app
EOF

cat > $PWD/Web01/map.sh << EOF
#!/usr/bin/env bash
python3 -m web_dynamic.gap_map
EOF

sudo chmod +x $PWD/Web01/map.sh
sudo chmod +x $PWD/Web01/api.sh

cd Web01

sudo screen -dmS API $PWD/api.sh
sudo screen -dmS map $PWD/map.sh
