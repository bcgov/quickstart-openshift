set -eux

TRIGGERS=(
    'package.json'
    'package-lock.json'
    'Dockerfile'
    '.src/'
    '.github/workflows/'
)

while read -r check
do
    for t in "${TRIGGERS[@]}"; do
        if [[ "${check}" =~ "${t}" ]]
        then
            echo -e "${t}\n --> ${check}\n"
            exit 0
        fi
    done
done < <(git diff --name-only)
